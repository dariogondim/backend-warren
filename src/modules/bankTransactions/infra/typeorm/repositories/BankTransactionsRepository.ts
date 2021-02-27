import { getRepository, Repository } from 'typeorm';

import IBankTransactionsRepository from '@modules/bankTransactions/repositories/IBankTransactionsRepository';
import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import ICreateWithdrawDTO from '@modules/bankTransactions/dtos/ICreateWithdrawDTO';
import ICreatePaymentDTO from '@modules/bankTransactions/dtos/ICreatePaymentDTO';
import ICreatePaymentOutsideDTO from '@modules/bankTransactions/dtos/ICreatePaymentOutsideDTO';
import BankTransactions from '../entities/BankTransactions';

class BankTransactionsRepository implements IBankTransactionsRepository {
  private ormRepository: Repository<BankTransactions>;

  constructor() {
    this.ormRepository = getRepository(BankTransactions);
  }

  public async getTransactionsForBalanceByBankAccount(
    bank_account_sender_id: string,
  ): Promise<BankTransactions[]> {
    const banksTransactions = await this.ormRepository.find({
      where: [
        {
          bank_account_sender_id,
        },
        {
          bank_account_recipient_id: bank_account_sender_id,
        },
      ],
      order: {
        compensationDate: 'ASC',
      },
      relations: ['profitability'],
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
