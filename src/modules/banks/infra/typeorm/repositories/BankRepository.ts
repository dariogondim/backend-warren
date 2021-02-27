import IBankRepository from '@modules/banks/repositories/IBankRepository';
import { getRepository, Repository } from 'typeorm';
import Bank from '../entities/Bank';

class BankRepository implements IBankRepository {
  private ormRepository: Repository<Bank>;

  constructor() {
    this.ormRepository = getRepository(Bank);
  }

  public async findById(id: string): Promise<Bank | undefined> {
    const bank = await this.ormRepository.findOne({
      where: { id },
    });

    return bank;
  }
}

export default BankRepository;
