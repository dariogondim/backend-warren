import 'reflect-metadata';

import Agency from '@modules/agencies/infra/typeorm/entities/Agency';
import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import FakeBankAccountRepository from '@modules/bankAccounts/repositories/fakes/FakeBankAccountRepository';
import Bank from '@modules/banks/infra/typeorm/entities/Bank';
import { BANK_TRANSACTIONS } from '@modules/bankTransactions/infra/typeorm/constants/BankTransactions.constants';
import {
  agencyFake1,
  bankAccountFake1,
  bankAccountFake2,
  bankFake1,
  clienteHasUserFake1,
  clientFake1,
  depositFake1,
  withdrawFake1,
  profitabilityFake1,
  userFake1,
} from '@shared/providers/fakes/FakeBankTransactionsObjs';
import FakeBankTransactionsRepository from '@modules/bankTransactions/repositories/fakes/FakeBankTransactionsRepository';
import Client from '@modules/clients/infra/typeorm/entities/Client';
import Profitability from '@modules/profitabilities/infra/typeorm/entities/Profitability';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ClientsHasUsers from '@modules/users_has_clients/infra/typeorm/entities/ClientsHasUsers';

import fakeDatabase from '@shared/providers/fakes/FakeDatabase';
import User from '@modules/users/infra/typeorm/entities/User';
import BankTransactions from '@modules/bankTransactions/infra/typeorm/entities/BankTransactions';
import AppError from '@shared/errors/AppError';
import CreateDepositService from '../CreateDepositService';
import CreateWithdrawService from '../CreateWithdrawService';

let fakeUsersRepository: FakeUsersRepository;
let fakeBankTransactionsRepository: FakeBankTransactionsRepository;
let fakeBankAccountRepository: FakeBankAccountRepository;

let withdrawService: CreateWithdrawService;
let depositService: CreateDepositService;

describe('Test WITHDRAW transaction', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeBankTransactionsRepository = new FakeBankTransactionsRepository();
    fakeBankAccountRepository = new FakeBankAccountRepository();

    withdrawService = new CreateWithdrawService(
      fakeBankTransactionsRepository,
      fakeUsersRepository,
      fakeBankAccountRepository,
    );

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
    const fakeBankAccount2 = Object.assign(new BankAccount(), bankAccountFake2);

    fakeDatabase.resetDatabase();

    fakeDatabase.fakeUsers.push(fakeUser);

    fakeDatabase.fakeClients.push(fakeClient);
    fakeDatabase.fakeClientsHasUsers.push(fakeClientHasUser);

    fakeDatabase.fakeBanks.push(fakeBank);
    fakeDatabase.fakeAgencies.push(fakeAgency);

    fakeDatabase.fakeProfitabilities.push(fakeProfitability);
    fakeDatabase.fakeBanksAccounts.push(fakeBankAccount);
    fakeDatabase.fakeBanksAccounts.push(fakeBankAccount2);

    // console.log('AAA', fakeDatabase);
  });

  it('The TYPE_TRANSACTION is WITHDRAW', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const withdraw = await withdrawService.execute({
      ...withdrawFake1,
      user_id: userFake1.id,
    });

    await expect(withdraw.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Withdraw,
    );
  });

  it('The STATUS is APPROVED', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );
    const withdraw = await withdrawService.execute({
      ...withdrawFake1,
      user_id: userFake1.id,
    });

    await expect(withdraw.status).toEqual(BANK_TRANSACTIONS.status.Approved);
  });

  it('The ORIGIN transaction is TED', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const withdraw = await withdrawService.execute({
      ...withdrawFake1,
      user_id: userFake1.id,
    });

    await expect(withdraw.originTransaction).toEqual(
      BANK_TRANSACTIONS.originTransaction.Ted,
    );
  });

  it('The CHANNEL transaction has invalid value then throw error', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const withdrawModified = Object.assign(
      new BankTransactions(),
      withdrawFake1,
    );
    withdrawModified.channel = 'invalid value';

    const withdraw = withdrawService.execute({
      ...withdrawModified,
      user_id: userFake1.id,
    });

    await expect(withdraw).rejects.toBeInstanceOf(AppError);
  });

  it('The VALUE transaction has NEGATIVE value, then throw error', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const withdrawModified = Object.assign(
      new BankTransactions(),
      withdrawFake1,
    );
    withdrawModified.value = -100;

    const withdraw = withdrawService.execute({
      ...withdrawModified,
      user_id: userFake1.id,
    });

    await expect(withdraw).rejects.toBeInstanceOf(AppError);
  });

  it('The TOKEN HAS NOT ASSOCIATED transaction then throw error', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const withdraw = withdrawService.execute({
      ...withdrawFake1,
      user_id: 'invalid value',
    });

    await expect(withdraw).rejects.toBeInstanceOf(AppError);
  });

  it('The SENDER_ID transaction has value invalid then throw error', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const withdrawModified = Object.assign(
      new BankTransactions(),
      withdrawFake1,
    );
    withdrawModified.bank_account_sender_id = 'invalid value';

    const withdraw = withdrawService.execute({
      ...withdrawModified,
      user_id: userFake1.id,
    });

    await expect(withdraw).rejects.toBeInstanceOf(AppError);
  });
});

// conta, usuario, agencia, banco, profitabilty, client, clienthasUser;
