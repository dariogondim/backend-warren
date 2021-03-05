import { container, injectable } from 'tsyringe';

import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import IRetrieveBankStatementDTO from '@modules/bankTransactions/dtos/IRetrieveBankStatementDTO';
import IRetrieveBankStatementItemDTO from '@modules/bankTransactions/dtos/IRetrieveBankStatementItemDTO';
import { BANK_TRANSACTIONS } from '@modules/bankTransactions/infra/typeorm/constants/BankTransactions.constants';
import moment from 'moment';
import BankTransactions from '@modules/bankTransactions/infra/typeorm/schemas/BankTransactions';
import GetObjsTransactionsService from './GetObjsTransactionsService';

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

function getTaxProfitability(
  transactionsInSameDtRef: BankTransactions[],
  taxProfitabilityBefore: number,
): number {
  // determina a taxa pela primeira que a taxa for aplicada ao dia ou segue com a taxa anterior se não tem novos objetos
  if (transactionsInSameDtRef.length > 0) {
    let profitabilityToday = 0;
    // se alguma taxa for aplicada no dia, recupera a primeira delas. se nenhuma taxa foi aplicada no dia, retorna 0
    transactionsInSameDtRef.forEach(transaction => {
      if (transaction.profitability) {
        if (profitabilityToday === 0) {
          profitabilityToday = transaction.profitability.tax;
        }
      }
    });
    return profitabilityToday;
  }
  return taxProfitabilityBefore;
}

// só compensa imediatamente, pagamentos, para efeitos de saldo, embora só vão entrar no futuro, porque podem ser cancelados
function checkCompensateTypeTransactionForSecurityBalance(
  transaction: BankTransactions,
  bankAccount: BankAccount,
): boolean {
  const alreadyCompensated = moment(
    transaction.compensationDate,
  ).isSameOrBefore(moment());

  const isReceipt =
    transaction.bankAccountRecipient?.id === bankAccount.id ||
    transaction.typeTransaction === BANK_TRANSACTIONS.typeTransaction.Deposit;
  // se foi saque ou um pagamento, compense imediatamente

  if (
    transaction.typeTransaction ===
      BANK_TRANSACTIONS.typeTransaction.Withdraw ||
    !isReceipt
  ) {
    return true;
  }
  // se foi um depósito ou um recebimento, espera a data de compensação, se não tiver compensado

  return alreadyCompensated;
}

function getDateLimit(dtLastTransaction: Date) {
  if (moment(dtLastTransaction).isAfter(moment())) {
    return dtLastTransaction;
  }
  return moment();
}

@injectable()
class CalculateBalanceAndExtractService {
  public async execute({
    banksTransactions,
    bankAccount,
    from,
    to,
  }: IRequest): Promise<IRetrieveBankStatementDTO> {
    const objs: IRetrieveBankStatementItemDTO[] = [];

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

    // pressupoe-se que as datas já vieram ordenadas da consulta
    if (banksTransactions.length > 0) {
      const getObjsService = container.resolve(GetObjsTransactionsService);

      let balancePrevAndFinal = 0;
      let taxProfitability = 0;
      const dtStart = moment(banksTransactions[0].compensationDate).startOf(
        'day',
      );
      const dtEnd = moment(
        banksTransactions[banksTransactions.length - 1].compensationDate,
      );

      while (dtStart.isSameOrBefore(getDateLimit(dtEnd.toDate()))) {
        const transactionsInSameDtRef = banksTransactions.filter(bt => {
          return dtStart.isSame(moment(bt.compensationDate), 'day');
        });

        let minBalanceInDay =
          transactionsInSameDtRef.length === 0 ? balancePrevAndFinal : -1;
        // eslint-disable-next-line no-loop-func
        transactionsInSameDtRef.forEach((bt, index) => {
          const alreadyCompensated = checkCompensateTypeTransactionForSecurityBalance(
            bt,
            bankAccount,
          );
          const amount = getValueAmount(bt.typeTransaction, bt.value);

          const obj: IRetrieveBankStatementItemDTO = {
            amount,
            balancePrev: balancePrevAndFinal,
            newBalance: balancePrevAndFinal + amount,
            dtRef: moment(bt.compensationDate).utc(true).toDate(),
            typeTransaction: bt.typeTransaction,
            memo: bt.memo,
          };

          if (alreadyCompensated) {
            balancePrevAndFinal += amount; // acumula o valor anterior
          }

          if (index === 0) {
            minBalanceInDay = balancePrevAndFinal;
          } else if (balancePrevAndFinal < minBalanceInDay) {
            minBalanceInDay = balancePrevAndFinal;
          }

          objs.push(obj);
        });

        taxProfitability = getTaxProfitability(
          transactionsInSameDtRef,
          taxProfitability,
        );

        const valueProfitability = getObjsService.getMonetizedValue(
          minBalanceInDay,
          taxProfitability,
          dtStart.toDate(),
        );
        if (valueProfitability > 0) {
          const obj: IRetrieveBankStatementItemDTO = {
            amount: valueProfitability,
            balancePrev: balancePrevAndFinal,
            balanceMonetizing: minBalanceInDay,
            newBalance: balancePrevAndFinal + valueProfitability,
            dtRef: moment(dtStart)
              .utc(true)
              .add(1, 'day')
              .startOf('day')
              .toDate(),
            typeTransaction: BANK_TRANSACTIONS.typeTransaction.Profitability,
            memo: 'your $money$ monetizing...!',
          };

          balancePrevAndFinal += valueProfitability;
          objs.push(obj);
        }

        dtStart.add(1, 'day').startOf('day'); // adiciona um dia completo
      }

      // filra os objetos conforme from and to

      result.extract.objs = objs;
      result.balance = balancePrevAndFinal;

      if (from && to) {
        const resultFiltred = result.extract.objs.filter(obj => {
          const fromDate = moment(from).startOf('day');
          const toDate = moment(to).endOf('day');
          return moment(obj.dtRef).isBetween(fromDate, toDate);
        });
        result.extract.objs = resultFiltred;
      }
    }
    return result;
  }
}

export default CalculateBalanceAndExtractService;
