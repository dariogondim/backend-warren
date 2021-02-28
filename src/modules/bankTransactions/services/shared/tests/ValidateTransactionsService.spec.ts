import 'reflect-metadata';

import { BANK_TRANSACTIONS2 } from '@modules/bankTransactions/infra/typeorm/constants/BankTransactions.constants';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ClientsHasUsers from '@modules/users_has_clients/infra/typeorm/entities/ClientsHasUsers';
import Client from '@modules/clients/infra/typeorm/entities/Client';
import fakeDatabase from '@shared/providers/fakes/FakeDatabase';
import ValidateTransactionsService from '../ValidateTransactionsService';

let validateService: ValidateTransactionsService;
let fakeUsersRepository: IUsersRepository;

describe('Validate ORIGIN transactions value', () => {
  beforeEach(() => {
    fakeDatabase.resetDatabase();

    validateService = new ValidateTransactionsService();
  });

  it('the transaction source property is expected to have a valid value', async () => {
    const promises: any = [];
    BANK_TRANSACTIONS2.originTransaction.forEach(async originTransaction => {
      promises.push(
        validateService.validateOriginTransaction({
          originTransaction,
        }),
      );
    });

    const response = await Promise.all(promises);
    await expect(!response.includes(false)).toEqual(true);
  });

  it(
    'the transaction source property is expected to throw error when it does' +
      ' not have a valid value',
    async () => {
      await expect(
        await validateService.validateOriginTransaction({
          originTransaction: 'invalidValue',
        }),
      ).toEqual(false);
    },
  );
});

describe('Validate CHANNEL transactions value', () => {
  beforeEach(() => {
    fakeDatabase.resetDatabase();

    validateService = new ValidateTransactionsService();
  });

  it('the transaction source property is expected to have a valid value', async () => {
    const promises: any = [];
    BANK_TRANSACTIONS2.channel.forEach(async channel => {
      promises.push(
        validateService.validateChannelTransaction({
          channel,
        }),
      );
    });

    const response = await Promise.all(promises);
    await expect(!response.includes(false)).toEqual(true);
  });

  it(
    'the transaction source property is expected to throw error when it does' +
      ' not have a valid value',
    async () => {
      await expect(
        await validateService.validateChannelTransaction({
          channel: 'invalidValue',
        }),
      ).toEqual(false);
    },
  );
});

describe('Validate VALUE property', () => {
  beforeEach(() => {
    fakeDatabase.resetDatabase();

    validateService = new ValidateTransactionsService();
  });

  it('has positive value valid', async () => {
    await expect(
      await validateService.bankTransactionsHasPositiveValue({
        value: 100,
      }),
    ).toEqual(true);
  });

  it('has negative value invalid', async () => {
    await expect(
      await validateService.bankTransactionsHasPositiveValue({
        value: -100,
      }),
    ).toEqual(false);
  });
});

describe('checkTokenClientHasAssociatedBankAccountId', () => {
  beforeEach(() => {
    fakeDatabase.resetDatabase();

    validateService = new ValidateTransactionsService();
    fakeUsersRepository = new FakeUsersRepository();
  });

  it('is associated', async () => {
    const user = await fakeUsersRepository.create(new User());

    const clientId = 'a1345985-627f-4129-80bf-2e08e5daccda';

    const client = new Client();
    client.id = 'a1345985-627f-4129-80bf-2e08e5daccda';

    const clientHasUser = new ClientsHasUsers();

    clientHasUser.user_id = user.id;
    clientHasUser.client_id = client.id;
    user.clients_has_users = [];
    user.clients_has_users.push(clientHasUser);

    await expect(
      await validateService.checkTokenClientHasAssociatedBankAccountId({
        user_id: user.id,
        userRepository: fakeUsersRepository,
        client_id: clientId,
      }),
    ).toEqual(true);
  });

  it('is not associated', async () => {
    const user = await fakeUsersRepository.create(new User());

    const clientId = 'b3fe0e30-7eee-41a4-9d8b-65c04afcd8d6';

    const client = new Client();
    client.id = 'a1345985-627f-4129-80bf-2e08e5daccda';

    const clientHasUser = new ClientsHasUsers();

    clientHasUser.user_id = user.id;
    clientHasUser.client_id = client.id;
    user.clients_has_users = [];
    user.clients_has_users.push(clientHasUser);

    await expect(
      await validateService.checkTokenClientHasAssociatedBankAccountId({
        user_id: user.id,
        userRepository: fakeUsersRepository,
        client_id: clientId,
      }),
    ).toEqual(false);
  });
});
