import { injectable, inject, container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IBankAccountRepository from '@modules/bankAccounts/repositories/IBankAccountRepository';
import IBankTransactionsRepository from '../repositories/IBankTransactionsRepository';
import BankTransactions from '../infra/typeorm/entities/BankTransactions';
import ValidateTransactionsService from './shared/ValidateTransactionsService';
import GetObjsTransactionsService from './shared/GetObjsTransactionsService';

interface IRequest {
  channel: string;
  channelDescription: string;
  value: number;
  bank_account_sender_id: string; // de onde parte o saque
  memo: string;
  user_id: string; // o id do usuário que se autenticou
}

@injectable()
class CreateWithdrawService {
  constructor(
    @inject('BankTransactionsRepository')
    private bankTransactionsRepository: IBankTransactionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('BankAccountRepository')
    private bankAccountRepository: IBankAccountRepository,
  ) {}

  public async execute({
    channel,
    channelDescription,
    value,
    bank_account_sender_id,
    memo,
    user_id,
  }: IRequest): Promise<BankTransactions> {
    // bussiness roles

    const validateService = container.resolve(ValidateTransactionsService);

    if (!(await validateService.validateChannelTransaction({ channel }))) {
      throw new AppError('Channel transaction does not have a valid value');
    }

    if (!bank_account_sender_id) {
      throw new AppError('The bank account needs to be selected');
    }

    if (!(await validateService.bankTransactionsHasPositiveValue({ value }))) {
      throw new AppError('The value transaction is a invalid value');
    }

    const getObjsService = container.resolve(GetObjsTransactionsService);

    const status = await getObjsService.getBankTransactionsStatusApproved();
    const typeTransaction = await getObjsService.getBankTransactionsTypeTransactionWithdraw();

    const originTransaction = await getObjsService.getBankTransactionsTypeTransactionWithdraw(); // irrelevante em saques

    const compensationDate = await getObjsService.getCompensationDate({
      originTransaction,
    });

    const bankAccount = await getObjsService.getBankAccountObject(
      bank_account_sender_id,
      this.bankAccountRepository,
    );

    if (!bankAccount) {
      throw new AppError('The bank account not found', 404);
    }

    if (
      !(await validateService.checkTokenClientHasAssociatedBankAccountId({
        user_id,
        userRepository: this.usersRepository,
        client_id: bankAccount.client_id,
      }))
    ) {
      throw new AppError(
        'You do not have permission to access this account',
        401,
      );
    }

    if (
      !(await validateService.checkHasBalanceSuficient({
        withdrawValue: value,
        bankAccount,
        bankTransactionsRepository: this.bankTransactionsRepository,
      }))
    ) {
      throw new AppError('Insufficient funds');
    }

    const profitability_id = bankAccount?.profitability_id;

    const bankTransactionDeposit = this.bankTransactionsRepository.create({
      originTransaction,
      channel,
      channelDescription,
      value,
      bank_account_sender_id,
      memo,
      status,
      typeTransaction,
      compensationDate,
      profitability_id,
    });

    return bankTransactionDeposit;
  }
}

export default CreateWithdrawService;
