import { getRepository, MoreThanOrEqual, Repository } from 'typeorm';

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

  public async findAllByBankAccount(
    bank_account_sender_id: string,
  ): Promise<BankTransactions[]> {
    const banksTransactions = await this.ormRepository.find({
      where: [
        {
          bank_account_sender_id,
        },
        { created_at: MoreThanOrEqual(new Date()) },
      ],
      order: {
        created_at: 'ASC',
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
