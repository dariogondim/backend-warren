import IBankTransactionsRepository from '@modules/bankTransactions/repositories/IBankTransactionsRepository';
import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import ICreateWithdrawDTO from '@modules/bankTransactions/dtos/ICreateWithdrawDTO';
import ICreatePaymentDTO from '@modules/bankTransactions/dtos/ICreatePaymentDTO';
import ICreatePaymentOutsideDTO from '@modules/bankTransactions/dtos/ICreatePaymentOutsideDTO';
import { getMongoRepository, MongoRepository } from 'typeorm';
import BankTransactions from '../schemas/BankTransactions';

class BankTransactionsRepository implements IBankTransactionsRepository {
  private ormRepository: MongoRepository<BankTransactions>;

  constructor() {
    this.ormRepository = getMongoRepository(BankTransactions, 'mongo');
  }

  public async getTransactionsForBalanceByBankAccount(
    bank_account_sender_id: string,
  ): Promise<BankTransactions[]> {
    const banksTransactions = await this.ormRepository.find({
      where: {
        $or: [
          { bank_account_sender_id },
          { bank_account_recipient_id: bank_account_sender_id },
        ],
      },

      order: {
        compensationDate: 'ASC',
      },
      // relations: ['profitability'],
    });

    return banksTransactions;
  }

  public async create(
    data:
      | ICreateDepositDTO
      | ICreateWithdrawDTO
      | ICreatePaymentDTO
      | ICreatePaymentOutsideDTO,
  ): Promise<BankTransactions> {
    const banksTransactions = this.ormRepository.create(data);

    await this.ormRepository.save(banksTransactions);

    return banksTransactions;
  }
}

export default BankTransactionsRepository;
