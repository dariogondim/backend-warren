import { injectable } from 'tsyringe';

import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import IRetrieveBankStatementDTO from '@modules/bankTransactions/dtos/IRetrieveBankStatementDTO';
import IRetrieveBankStatementItemDTO from '@modules/bankTransactions/dtos/IRetrieveBankStatementItemDTO';
import { BANK_TRANSACTIONS } from '@modules/bankTransactions/infra/typeorm/constants/BankTransactions.constants';
import moment from 'moment';
import BankTransactions from '../../infra/typeorm/entities/BankTransactions';

interface IRequest {
  banksTransactions: BankTransactions[];
  bankAccount: BankAccount;
  from?: string;
  to?: string;
}

function getValueAmount(typeTransaction: string, value: number): number {
  if (typeTransaction === BANK_TRANSACTIONS.typeTransaction.Deposit) {
    return value;
  }

  return -value;
}

function getProfitabilityObjs(
  balance: number,
  bt: BankTransactions,
  btNext?: BankTransactions,
): IRetrieveBankStatementItemDTO[] {
  const objs: IRetrieveBankStatementItemDTO[] = [];

  let balancePrev = balance;
  let dtNextTransaction;

  if (btNext) {
    dtNextTransaction = moment(btNext.created_at);
  } else {
    dtNextTransaction = moment(new Date());
  }

  const dtTransaction = moment(bt.created_at);

  const compensateProfitabilityDaily =
    bt.profitability &&
    bt.typeTransaction === BANK_TRANSACTIONS.typeTransaction.Deposit &&
    bt.profitability.type_profitability === 'daily' &&
    moment(bt.created_at).isSameOrBefore(new Date());

  if (compensateProfitabilityDaily) {
    // a cada dia que o saldo anterior permanece na conta...

    while (dtNextTransaction.diff(dtTransaction, 'minute') >= 1440) {
      const obj: IRetrieveBankStatementItemDTO = {
        amount: bt.value,
        balancePrev,
        newBalance: 0,
        dtRef: moment(bt.created_at).toDate(),
        typeTransaction: bt.typeTransaction,
      };

      const balanceBefore = balancePrev; // salva o saldo anterior antes da taxa
      const balanceGain = balanceBefore * bt.profitability.tax; // o balanço ganho com a aplicação da taxa
      balancePrev += balanceGain; // pega o saldo que tinha naquele dia e soma com o balanço
      obj.newBalance = balancePrev; // o objeto registra o novo saldo, decorrente da aplicação da taxa
      obj.amount = balanceGain; // o saldo do objeto é o valor ganho com a taxa
      obj.typeTransaction = BANK_TRANSACTIONS.typeTransaction.Profitability; // o tipo da transação é profitability
      objs.push(obj);

      dtTransaction.add(1440, 'minute'); // adiciona um dia em minutos
      // console.log(
      //   dtNextTransaction.diff(dtTransaction, 'minute'),
      //   moment(bt.created_at),
      //   dtTransaction,
      //   dtNextTransaction,
      //   balanceGain,
      //   obj,
      // );
    }
  }

  return objs;
}

@injectable()
class CalculateBalanceAndExtractService {
  public async execute({
    banksTransactions,
    bankAccount,
    from,
    to,
  }: IRequest): Promise<IRetrieveBankStatementDTO> {
    const objs: IRetrieveBankStatementItemDTO[] = [
      {
        amount: 0,
        balancePrev: 0,
        dtRef: new Date(),
        newBalance: 0,
        typeTransaction: '-',
      },
    ];
    let balancePrev = 0;

    banksTransactions.forEach((bt, index, array) => {
      const amount = getValueAmount(bt.typeTransaction, bt.value);
      const obj: IRetrieveBankStatementItemDTO = {
        amount,
        balancePrev,
        newBalance: balancePrev + amount,
        dtRef: moment(bt.created_at).toDate(),
        typeTransaction: bt.typeTransaction,
      };

      balancePrev += obj.amount; // acumula o valor anterior

      objs.push(obj);

      const objsProfitabilities = getProfitabilityObjs(
        balancePrev,
        bt,
        index < array.length ? array[index + 1] : undefined, // se não tem próximo, manda undefined
      );

      // adiciona os objetos profitabilities após as transações correspondentes
      if (objsProfitabilities.length > 0) {
        objsProfitabilities.forEach(objP => {
          objs.push(objP);
        });
        balancePrev =
          objsProfitabilities[objsProfitabilities.length - 1].newBalance; // atualiza o balanço anterior com o último balanço dos profitabilities
      }
    });

    const result: IRetrieveBankStatementDTO = {
      bankAccount: {
        agency: bankAccount.agency.cod,
        cc: bankAccount.cc,
        client: bankAccount.client.fullname,
        bank: bankAccount.agency.bank.name,
      },
      balance: 0,
      extract: {
        from,
        to,
        objs,
      },
    };

    if (result.extract.objs.length > 0) {
      result.extract.objs.splice(0, 1); // remove o primeiro elemento, que era zerado
      result.balance =
        result.extract.objs[result.extract.objs.length - 1].newBalance; // pega o balanço da última posição
    }

    // filra os objetos conforme from and to

    if (from && to) {
      const resultFiltred = result.extract.objs.filter(obj => {
        const fromDate = moment(from).set({
          hour: 0,
          minute: 0,
          second: 0,
          millisecond: 0,
        });
        const toDate = moment(to).set({
          hour: 23,
          minute: 59,
          second: 59,
          millisecond: 999,
        });
        return moment(obj.dtRef).isBetween(fromDate, toDate);
      });

      result.extract.objs = resultFiltred;
    }

    return result;
  }
}

export default CalculateBalanceAndExtractService;
