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
  paymentExternalFake1,
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
import FakeBankRepository from '@modules/banks/repositories/fakes/FakeBankRepository';
import CreateDepositService from '../CreateDepositService';
import CreatePaymentServiceExternal from '../CreatePaymentServiceExternal';

let fakeUsersRepository: FakeUsersRepository;
let fakeBankTransactionsRepository: FakeBankTransactionsRepository;
let fakeBankAccountRepository: FakeBankAccountRepository;
let fakeBankRepository: FakeBankRepository;

let paymentServiceExternal: CreatePaymentServiceExternal;
let depositService: CreateDepositService;

describe('Test PAYMENT transaction', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeBankTransactionsRepository = new FakeBankTransactionsRepository();
    fakeBankAccountRepository = new FakeBankAccountRepository();

    paymentServiceExternal = new CreatePaymentServiceExternal(
      fakeBankTransactionsRepository,
      fakeUsersRepository,
      fakeBankAccountRepository,
      fakeBankRepository,
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

  it('The TYPE_TRANSACTION is PAYMENT', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const payment = await paymentServiceExternal.execute({
      ...paymentExternalFake1,
      user_id: userFake1.id,
    });

    await expect(payment.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Payment,
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
    const payment = await paymentServiceExternal.execute({
      ...paymentExternalFake1,
      user_id: userFake1.id,
    });

    await expect(payment.status).toEqual(BANK_TRANSACTIONS.status.Approved);
  });

  it('The ORIGIN transaction has invalid value then throw error', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const paymentModified = Object.assign(
      new BankTransactions(),
      paymentExternalFake1,
    );
    paymentModified.originTransaction = 'invalid value';

    const payment = paymentServiceExternal.execute({
      ...paymentModified,
      user_id: userFake1.id,
    });

    await expect(payment).rejects.toBeInstanceOf(AppError);
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

    const paymentModified = Object.assign(
      new BankTransactions(),
      paymentExternalFake1,
    );
    paymentModified.channel = 'invalid value';

    const payment = paymentServiceExternal.execute({
      ...paymentModified,
      user_id: userFake1.id,
    });

    await expect(payment).rejects.toBeInstanceOf(AppError);
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

    const paymentModified = Object.assign(
      new BankTransactions(),
      paymentExternalFake1,
    );
    paymentModified.value = -100;

    const payment = paymentServiceExternal.execute({
      ...paymentModified,
      user_id: userFake1.id,
    });

    await expect(payment).rejects.toBeInstanceOf(AppError);
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

    const payment = paymentServiceExternal.execute({
      ...paymentExternalFake1,
      user_id: 'invalid value',
    });

    await expect(payment).rejects.toBeInstanceOf(AppError);
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

    const paymentModified = Object.assign(
      new BankTransactions(),
      paymentExternalFake1,
    );
    paymentModified.bank_account_sender_id = 'invalid value';

    const payment = paymentServiceExternal.execute({
      ...paymentModified,
      user_id: userFake1.id,
    });

    await expect(payment).rejects.toBeInstanceOf(AppError);
  });

  it('The RECIPIENT_ID transaction has value invalid then throw error', async () => {
    // adicionado depósito para que haja saldo para o pagamento
    const deposit = await depositService.execute({
      ...depositFake1,
      user_id: userFake1.id,
    });

    await expect(deposit.typeTransaction).toEqual(
      BANK_TRANSACTIONS.typeTransaction.Deposit,
    );

    const paymentModified = Object.assign(
      new BankTransactions(),
      paymentExternalFake1,
    );
    paymentModified.bank_account_recipient_id = 'invalid value';

    const payment = paymentServiceExternal.execute({
      ...paymentModified,
      user_id: userFake1.id,
    });

    await expect(payment).rejects.toBeInstanceOf(AppError);
  });
});

// conta, usuario, agencia, banco, profitabilty, client, clienthasUser;
