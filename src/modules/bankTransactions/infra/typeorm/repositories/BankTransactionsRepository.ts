import { getRepository, Not, Repository } from 'typeorm';

import IBankTransactionsRepository from '@modules/bankTransactions/repositories/IBankTransactionsRepository';
import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import BankTransactions from '../entities/BankTransactions';

class BankTransactionsRepository implements IBankTransactionsRepository {
  private ormRepository: Repository<BankTransactions>;

  constructor() {
    this.ormRepository = getRepository(BankTransactions);
  }

  public async createDeposit(
    data: ICreateDepositDTO,
  ): Promise<BankTransactions> {
    const bankRepository = this.ormRepository.create(data);

    await this.ormRepository.save(bankRepository);

    return bankRepository;
  }
}

export default BankTransactionsRepository;
