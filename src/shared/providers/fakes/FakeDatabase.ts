import Agency from '@modules/agencies/infra/typeorm/entities/Agency';
import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import Bank from '@modules/banks/infra/typeorm/entities/Bank';
import BankTransactions from '@modules/bankTransactions/infra/typeorm/entities/BankTransactions';
import Client from '@modules/clients/infra/typeorm/entities/Client';
import Profitability from '@modules/profitabilities/infra/typeorm/entities/Profitability';
import User from '@modules/users/infra/typeorm/entities/User';
import ClientsHasUsers from '@modules/users_has_clients/infra/typeorm/entities/ClientsHasUsers';

class FakeDatabase {
  fakeBanksTransactions: BankTransactions[];

  fakeProfitabilities: Profitability[];

  fakeBanksAccounts: BankAccount[];

  fakeClients: Client[];

  fakeAgencies: Agency[];

  fakeBanks: Bank[];

  fakeClientsHasUsers: ClientsHasUsers[];

  fakeUsers: User[];

  public resetDatabase(): void {
    this.fakeAgencies = [];
    this.fakeBanks = [];
    this.fakeBanksAccounts = [];
    this.fakeBanksTransactions = [];
    this.fakeClients = [];
    this.fakeClientsHasUsers = [];
    this.fakeProfitabilities = [];
    this.fakeUsers = [];
  }
}

const fakeDatabase: FakeDatabase = new FakeDatabase();

export default fakeDatabase;
