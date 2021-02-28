import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import IBankAccountRepository from '@modules/bankAccounts/repositories/IBankAccountRepository';
import fakeDatabase from '@shared/providers/fakes/FakeDatabase';

class FakeBankAccountRepository implements IBankAccountRepository {
  public async findById(id: string): Promise<BankAccount | undefined> {
    // filtra pelo id
    const bankAccount:
      | BankAccount
      | undefined = fakeDatabase.fakeBanksAccounts.find(ba => ba.id === id);

    if (bankAccount) {
      // adiciona o objeto cliente se tiver
      const client = fakeDatabase.fakeClients.find(
        cl => cl.id === bankAccount.client_id,
      );
      if (client) {
        // eslint-disable-next-line no-param-reassign
        bankAccount.client = client;
      }

      // adiciona o objeto agency se tiver
      const agency = fakeDatabase.fakeAgencies.find(
        ag => ag.id === bankAccount.agency_id,
      );
      if (agency) {
        // eslint-disable-next-line no-param-reassign
        bankAccount.agency = agency;
      }

      if (agency) {
        // adiciona o objeto bank na agency se tiver
        const bank = fakeDatabase.fakeBanks.find(
          bk => bk.id === agency.bank_id,
        );
        if (bank) {
          // eslint-disable-next-line no-param-reassign
          agency.bank = bank;
        }
      }
    }

    // tem que ficar igual a essa consulta comentada abaixo

    // const bankAccount = await this.banksAccounts.findOne({
    //   where: { id },
    //   relations: ['client', 'agency', 'agency.bank'],
    // });

    return bankAccount;
  }
}

export default FakeBankAccountRepository;
