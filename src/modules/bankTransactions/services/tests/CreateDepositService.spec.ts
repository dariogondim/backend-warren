import Agency from '@modules/agencies/infra/typeorm/entities/Agency';
import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import FakeBankAccountRepository from '@modules/bankAccounts/repositories/fakes/FakeBankAccountRepository';
import Bank from '@modules/banks/infra/typeorm/entities/Bank';
import { BANK_TRANSACTIONS } from '@modules/bankTransactions/infra/typeorm/constants/BankTransactions.constants';
import {
  agencyFake1,
  bankAccountFake1,
  bankFake1,
  clienteHasUserFake1,
  clientFake1,
  depositFake1,
  profitabilityFake1,
  userFake1,
} from '@shared/providers/fakes/FakeBankTransactionsObjs1';
import FakeBankTransactionsRepository from '@modules/bankTransactions/repositories/fakes/FakeBankTransactionsRepository';
import Client from '@modules/clients/infra/typeorm/entities/Client';
import Profitability from '@modules/profitabilities/infra/typeorm/entities/Profitability';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ClientsHasUsers from '@modules/users_has_clients/infra/typeorm/entities/ClientsHasUsers';
import 'reflect-metadata';

import fakeDatabase from '@shared/providers/fakes/FakeDatabase';
import User from '@modules/users/infra/typeorm/entities/User';
import BankTransactions from '@modules/bankTransactions/infra/typeorm/entities/BankTransactions';
import AppError from '@shared/errors/AppError';
import CreateDepositService from '../CreateDepositService';

let fakeUsersRepository: FakeUsersRepository;
let fakeBankTransactionsRepository: FakeBankTransactionsRepository;
let fakeBankAccountRepository: FakeBankAccountRepository;

let depositService: CreateDepositService;

describe('Test DEPOSIT transaction', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeBankTransactionsRepository = new FakeBankTransactionsRepository();
    fakeBankAccountRepository = new FakeBankAccountRepository();

    depositService = new CreateDepositService(
      fakeBankTransactionsRepository,
      fakeUsersRepository,
      fakeBankAccountRepository,
    );

    // objetos que criam os relacionamentos para os testes
    const fakeUser = Object.assign(new User(), userFake1);
    const fakeBank = Object.assign(new Bank(), bankFake1);
    const fakeAgency = Object.assign(new Agency(), agencyFake1);
    const fakeClient = Object.assign(new Client(), clientFake1);
    const fakeClientHasUser = Object.assign(
      new ClientsHasUsers(),
      clienteHasUserFake1,
    );
    const fakeProfitability = Object.assign(
      new Profitability(),
      profitabilityFake1,
    );
    const fakeBankAccount = Object.assign(new BankAccount(), bankAccountFake1);

    fakeDatabase.resetDatabase();

    fakeDatabase.fakeUsers.push(fakeUser);

    fakeDatabase.fakeClients.push(fakeClient);
    fakeDatabase.fakeClientsHasUsers.push(fakeClientHasUser);

    fakeDatabase.fakeBanks.push(fakeBank);
    fakeDatabase.fakeAgencies.push(fakeAgency);

    fakeDatabase.fakeProfitabilities.push(fakeProfitability);
    fakeDatabase.fakeBanksAccounts.push(fakeBankAccount);

    // console.log('AAA', fakeDatabase);
  });

  it('The TYPE_TRANSACTION is DEPOSIT', async () => {
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );
  });

  it('The STATUS is APPROVED', async () => {
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.status).toEqual(BANK_TRANSACTIONS.status.Approved);
  });

  it('The ORIGIN transaction has invalid value then throw error', async () => {
    const depositModified = Object.assign(new BankTransactions(), depositFake1);
    depositModified.originTransaction = 'invalid value';

    const deposit = depositService.execute({
      ...depositModified,
      user_id: userFake1.id,
    });

    await expect(deposit).rejects.toBeInstanceOf(AppError);
  });

  it('The CHANNEL transaction has invalid value then throw error', async () => {
    const depositModified = Object.assign(new BankTransactions(), depositFake1);
    depositModified.channel = 'invalid value';

    const deposit = depositService.execute({
      ...depositModified,
      user_id: userFake1.id,
    });

    await expect(deposit).rejects.toBeInstanceOf(AppError);
  });

  it('The VALUE transaction has NEGATIVE value, then throw error', async () => {
    const depositModified = Object.assign(new BankTransactions(), depositFake1);
    depositModified.value = -100;

    const deposit = depositService.execute({
      ...depositModified,
      user_id: userFake1.id,
    });

    await expect(deposit).rejects.toBeInstanceOf(AppError);
  });

  it('The TOKEN HAS NOT ASSOCIATED transaction then throw error', async () => {
    const deposit = depositService.execute({
      ...depositFake1,
      user_id: 'invalid value',
    });

    await expect(deposit).rejects.toBeInstanceOf(AppError);
  });

  it('The SENDER_ID transaction has value invalid then throw error', async () => {
    const depositModified = Object.assign(new BankTransactions(), depositFake1);
    depositModified.bank_account_sender_id = 'invalid value';

    const deposit = depositService.execute({
      ...depositModified,
      user_id: userFake1.id,
    });

    await expect(deposit).rejects.toBeInstanceOf(AppError);
  });
});

// conta, usuario, agencia, banco, profitabilty, client, clienthasUser;
