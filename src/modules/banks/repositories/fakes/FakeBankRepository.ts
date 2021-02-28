import Bank from '@modules/banks/infra/typeorm/entities/Bank';
import IBankRepository from '@modules/banks/repositories/IBankRepository';
import fakeDatabase from '@shared/providers/fakes/FakeDatabase';

class FakeBankRepository implements IBankRepository {
  public async findById(id: string): Promise<Bank | undefined> {
    const bank = await fakeDatabase.fakeBanks.find(bk => bk.id === id);

    return bank;
  }
}

export default FakeBankRepository;
