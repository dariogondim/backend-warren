import { injectable, inject, container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import moment from 'moment';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IBankAccountRepository from '@modules/bankAccounts/repositories/IBankAccountRepository';
import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import IBankTransactionsRepository from '../repositories/IBankTransactionsRepository';
import BankTransactions from '../infra/typeorm/entities/BankTransactions';
import {
  BANK_TRANSACTIONS,
  BANK_TRANSACTIONS2,
} from '../infra/typeorm/constants/BankTransactions.constants';
import CalculateBalanceAndExtractService from './shared/CalculateBalanceAndExtractService';

function validateChannelTransaction(channelTransaction: string) {
  return BANK_TRANSACTIONS2.channel.includes(channelTransaction);
}

function hasBankAccountSenderId(bank_account_sender_id: string) {
  return bank_account_sender_id;
}

function hasBankAccountRecipientId(bank_account_recipient_id: string) {
  return bank_account_recipient_id;
}

function validateValue(value: number) {
  return value > 0;
}

async function checkTokenClientHasAssociatedBankAccountId(
  user_id: string,
  userRepository: IUsersRepository,
  client_id: string | undefined,
) {
  const user = await userRepository.findById(user_id);
  return (
    user &&
    user.clients_has_users.length > 0 &&
    client_id &&
    user.clients_has_users[0].client_id === client_id
  );
}

async function getBankAccountObject(
  bank_account_sender_id: string,
  bankAccountRepository: IBankAccountRepository,
): Promise<BankAccount | undefined> {
  const bankAccount = await bankAccountRepository.findById(
    bank_account_sender_id,
  );
  return bankAccount;
}

function getCompensationDate(originTransaction: string): Date {
  if (originTransaction === BANK_TRANSACTIONS.originTransaction.Doc) {
    return moment().add(1, 'day').toDate(); // compensa no dia seguinte
  }
  if (originTransaction === BANK_TRANSACTIONS.originTransaction.Ted) {
    const todayAtFiveHours = moment().set({
      hour: 17,
      minute: 0,
      second: 0,
      millisecond: 0,
    });
    if (moment().isAfter(todayAtFiveHours, 'minute')) {
      return moment().add(1, 'day').toDate(); // compensa no dia seguinte
    }
  }
  return moment().toDate(); // compensa tão cedo quanto possível
}

async function checkHasBalanceSuficient(
  withdrawValue: number,
  bankAccount: BankAccount,
  bankTransactionsRepository: IBankTransactionsRepository,
) {
  const banksTransactions = await bankTransactionsRepository.findAllByBankAccount(
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

interface IRequest {
  originTransaction: string;
  channel: string;
  channelDescription: string;
  value: number;
  bank_account_sender_id: string; // de onde parte o pagamento/transferencia
  bank_account_recipient_id: string; // para onde vai o pagamento/transferencia
  memo: string;
  user_id: string; // o id do usuário que se autenticou
}

@injectable()
class CreatePaymentService {
  constructor(
    @inject('BankTransactionsRepository')
    private bankTransactionsRepository: IBankTransactionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('BankAccountRepository')
    private bankAccountRepository: IBankAccountRepository,
  ) {}

  public async execute({
    originTransaction,
    channel,
    channelDescription,
    value,
    bank_account_sender_id,
    bank_account_recipient_id,
    memo,
    user_id,
  }: IRequest): Promise<BankTransactions> {
    // bussiness roles

    if (!validateChannelTransaction(channel)) {
      throw new AppError('Channel transaction does not have a valid value');
    }

    if (!hasBankAccountSenderId(bank_account_sender_id)) {
      throw new AppError('The bank account needs to be selected');
    }

    if (!hasBankAccountRecipientId(bank_account_recipient_id)) {
      throw new AppError('The bank account destiny needs to be selected');
    }

    if (!validateValue(value)) {
      throw new AppError('The value transaction is a invalid value');
    }

    const status = BANK_TRANSACTIONS.status.Approved;
    const typeTransaction = BANK_TRANSACTIONS.typeTransaction.Payment;

    const compensationDate = getCompensationDate(originTransaction);

    const bankAccount = await getBankAccountObject(
      bank_account_sender_id,
      this.bankAccountRepository,
    );

    if (!bankAccount) {
      throw new AppError('The bank account not found', 404);
    }

    if (
      !(await checkTokenClientHasAssociatedBankAccountId(
        user_id,
        this.usersRepository,
        bankAccount?.client_id,
      ))
    ) {
      throw new AppError(
        'You do not have permission to access this account',
        401,
      );
    }

    if (
      !(await checkHasBalanceSuficient(
        value,
        bankAccount,
        this.bankTransactionsRepository,
      ))
    ) {
      throw new AppError('Insufficient funds');
    }

    const bankTransactionPaymentOrTransferInternal = this.bankTransactionsRepository.create(
      {
        originTransaction,
        channel,
        channelDescription,
        value,
        bank_account_sender_id,
        bank_account_recipient_id,
        memo,
        status,
        typeTransaction,
        compensationDate,
      },
    );

    return bankTransactionPaymentOrTransferInternal;
  }
}

export default CreatePaymentService;
