import IBankAccountRepository from '@modules/bankAccounts/repositories/IBankAccountRepository';
import { getRepository, Repository } from 'typeorm';

import BankAccount from '../entities/BankAccount';

class BankAccountRepository implements IBankAccountRepository {
  private ormRepository: Repository<BankAccount>;

  constructor() {
    this.ormRepository = getRepository(BankAccount);
  }

  public async findById(id: string): Promise<BankAccount | undefined> {
    const bankAccount = await this.ormRepository.findOne({ where: { id } });

    return bankAccount;
  }
}

export default BankAccountRepository;
