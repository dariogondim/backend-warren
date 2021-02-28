import { container, injectable } from 'tsyringe';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import { BANK_TRANSACTIONS2 } from '@modules/bankTransactions/infra/typeorm/constants/BankTransactions.constants';
import Bank from '@modules/banks/infra/typeorm/entities/Bank';
import IBankRepository from '@modules/banks/repositories/IBankRepository';
import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import IBankTransactionsRepository from '@modules/bankTransactions/repositories/IBankTransactionsRepository';
import CalculateBalanceAndExtractService from './CalculateBalanceAndExtractService';

@injectable()
class ValidateTransactionsService {
  public async validateOriginTransaction({
    originTransaction,
  }: {
    originTransaction: string;
  }): Promise<boolean> {
    return BANK_TRANSACTIONS2.originTransaction.includes(
      originTransaction || '',
    );
  }

  public async validateChannelTransaction({
    channel,
  }: {
    channel: string;
  }): Promise<boolean> {
    return BANK_TRANSACTIONS2.channel.includes(channel || '');
  }

  public async bankTransactionsHasPositiveValue({
    value,
  }: {
    value: number;
  }): Promise<boolean | undefined> {
    return !!value && value > 0;
  }

  public async checkTokenClientHasAssociatedBankAccountId({
    user_id,
    userRepository,
    client_id,
  }: {
    user_id: string;
    userRepository: IUsersRepository;
    client_id: string | undefined;
  }): Promise<boolean> {
    const user = await userRepository.findById(user_id);
    console.log('PPPP', user_id, user, client_id, user?.clients_has_users);
    return !!(
      user &&
      user.clients_has_users.length > 0 &&
      client_id &&
      user.clients_has_users[0].client_id === client_id
    );
  }

  // payments and withdraws

  //  não há tempo de testar essa, desculpe :(
  public async hasBankValid({
    bank_destiny_id,
    bankRepository,
  }: {
    bank_destiny_id: string;
    bankRepository: IBankRepository;
  }): Promise<Bank | undefined> {
    const bank = await bankRepository.findById(bank_destiny_id);
    return bank;
  }

  //  não há tempo de testar essa, desculpe :(
  public async hasPropertyDestinyExternal({
    bank_destiny_id,
    agencyDestiny,
    cpfDestiny,
    accountDestiny,
  }: {
    bank_destiny_id: string;
    agencyDestiny: string;
    cpfDestiny: string;
    accountDestiny: string;
  }): Promise<boolean> {
    return !!(bank_destiny_id && cpfDestiny && accountDestiny && agencyDestiny);
  }

  //  não há tempo de testar essa, desculpe :(
  public async checkHasBalanceSuficient({
    withdrawValue,
    bankAccount,
    bankTransactionsRepository,
  }: {
    withdrawValue: number;
    bankAccount: BankAccount;
    bankTransactionsRepository: IBankTransactionsRepository;
  }): Promise<boolean> {
    const banksTransactions = await bankTransactionsRepository.getTransactionsForBalanceByBankAccount(
      bankAccount.id,
    );

    const calculateBalanceAndExtractService = container.resolve(
      CalculateBalanceAndExtractService,
    );

    const result = await calculateBalanceAndExtractService.execute({
      banksTransactions,
      bankAccount,
    });

    const balanceCurrent = result.balance;

    const overdraft = 0; // chque especial

    return balanceCurrent + overdraft >= withdrawValue;
  }
}

export default ValidateTransactionsService;
