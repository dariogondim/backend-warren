import IBankTransactionsRepository from '@modules/bankTransactions/repositories/IBankTransactionsRepository';
import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import ICreateWithdrawDTO from '@modules/bankTransactions/dtos/ICreateWithdrawDTO';
import ICreatePaymentDTO from '@modules/bankTransactions/dtos/ICreatePaymentDTO';
import ICreatePaymentOutsideDTO from '@modules/bankTransactions/dtos/ICreatePaymentOutsideDTO';
import { uuid } from 'uuidv4';
import Profitability from '@modules/profitabilities/infra/typeorm/entities/Profitability';
import moment from 'moment';
import fakeDatabase from '@shared/providers/fakes/FakeDatabase';
import BankTransactions from '@modules/bankTransactions/infra/typeorm/schemas/BankTransactions';

function sortBankTransactionsByCompensationsDate(
  bankTransaction1: BankTransactions,
  bankTransaction2: BankTransactions,
) {
  const compensationDate1 = moment(bankTransaction1.compensationDate);
  const compensationDate2 = moment(bankTransaction2.compensationDate);

  if (compensationDate1.isAfter(compensationDate2)) {
    return 1;
  }
  if (compensationDate1.isBefore(compensationDate2)) {
    return -1;
  }
  return 0;
}

class FakeBankTransactionsRepository implements IBankTransactionsRepository {
  public async getTransactionsForBalanceByBankAccount(
    bank_account_sender_id: string,
  ): Promise<BankTransactions[]> {
    // filtra todas as transações com origem e destino em sender_id
    const banksTransactionsFiltered: BankTransactions[] = fakeDatabase.fakeBanksTransactions
      .filter(bt => bt.bank_account_sender_id === bank_account_sender_id)
      .filter(bt => bt.bank_account_recipient_id === bank_account_sender_id);

    // adiciona o objeto profitability se tiver
    banksTransactionsFiltered.forEach(bt => {
      const profitability = fakeDatabase.fakeProfitabilities.find(
        pf => bt.profitability_id === pf.id,
      );
      if (profitability) {
        // eslint-disable-next-line no-param-reassign
        bt.profitability = profitability;
      }
    });

    // ordena as transações por ordem crescente de data de compensação
    banksTransactionsFiltered.sort(sortBankTransactionsByCompensationsDate);

    // tem que ficar igual a essa consulta comentada abaixo

    // const banksTransactions = await this.ormRepository.find({
    //   where: [
    //     {
    //       bank_account_sender_id,
    //     },
    //     {
    //       bank_account_recipient_id: bank_account_sender_id,
    //     },
    //   ],
    //   order: {
    //     compensationDate: 'ASC',
    //   },
    //   relations: ['profitability'],
    // });

    return fakeDatabase.fakeBanksTransactions;
  }

  public async create(
    data:
      | ICreateDepositDTO
      | ICreateWithdrawDTO
      | ICreatePaymentDTO
      | ICreatePaymentOutsideDTO,
  ): Promise<BankTransactions> {
    // salva objeto da transação
    const bankTransaction = new BankTransactions();

    Object.assign(bankTransaction, { id: uuid() }, data);

    fakeDatabase.fakeBanksTransactions.push({ ...bankTransaction });

    return fakeDatabase.fakeBanksTransactions[
      fakeDatabase.fakeBanksTransactions.length - 1
    ];
  }

  // cria um objeto profitability para uso posterior
  public async createFakeProfitability(
    profitability: Profitability,
  ): Promise<void> {
    fakeDatabase.fakeProfitabilities.push(profitability);
  }
}

export default FakeBankTransactionsRepository;
