import { container } from 'tsyringe';

import '@modules/users/providers';
import './providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IClientsHasUsersRepository from '@modules/users_has_clients/repositories/IClientsHasUsersRepository';
import ClientsHasUsersRepository from '@modules/users_has_clients/infra/typeorm/repositories/ClientsHasUsersRepository';
import IBankTransactionsRepository from '@modules/bankTransactions/repositories/IBankTransactionsRepository';
import BankTransactionsRepository from '@modules/bankTransactions/infra/typeorm/repositories/BankTransactionsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IClientsHasUsersRepository>(
  'ClientsHasUsersRepository',
  ClientsHasUsersRepository,
);

container.registerSingleton<IBankTransactionsRepository>(
  'BankTransactionsRepository',
  BankTransactionsRepository,
);
