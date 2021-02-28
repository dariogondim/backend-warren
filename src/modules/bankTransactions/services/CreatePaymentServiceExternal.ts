import { injectable, inject, container } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IBankAccountRepository from '@modules/bankAccounts/repositories/IBankAccountRepository';
import IBankRepository from '@modules/banks/repositories/IBankRepository';
import IBankTransactionsRepository from '../repositories/IBankTransactionsRepository';
import BankTransactions from '../infra/typeorm/entities/BankTransactions';

import ValidateTransactionsService from './shared/ValidateTransactionsService';
import GetObjsTransactionsService from './shared/GetObjsTransactionsService';

interface IRequest {
  originTransaction: string;
  channel: string;
  channelDescription: string;
  value: number;
  bank_account_sender_id: string; // de onde parte o pagamento/transferencia
  memo: string;
  bank_destiny_id: string; // o banco de destino do pagamento, obrigatório se for pra outro banco
  agencyDestiny: string; // a agência de destino do pagamento,  obrigatório se for pra outro banco
  cpfDestiny: string; // o cpf de destino do pagamento, obrigatório se for pra outro banco
  accountDestiny: string; // a conta de destino do pagamento, obrigatório se for pra outro banco
  user_id: string; // o id do usuário que se autenticou
}

@injectable()
class CreatePaymentServiceExternal {
  constructor(
    @inject('BankTransactionsRepository')
    private bankTransactionsRepository: IBankTransactionsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('BankAccountRepository')
    private bankAccountRepository: IBankAccountRepository,

    @inject('BankRepository')
    private bankRepository: IBankRepository,
  ) {}

  public async execute({
    originTransaction,
    channel,
    channelDescription,
    value,
    bank_account_sender_id,
    memo,
    bank_destiny_id,
    agencyDestiny,
    cpfDestiny,
    accountDestiny,
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

    if (
      !(await validateService.hasBankValid({
        bank_destiny_id,
        bankRepository: this.bankRepository,
      }))
    ) {
      throw new AppError('The bank selected not found', 404);
    }

    if (
      !(await validateService.hasPropertyDestinyExternal({
        bank_destiny_id,
        agencyDestiny,
        cpfDestiny,
        accountDestiny,
      }))
    ) {
      throw new AppError(
        'The properties bank, agency, account e cpf destiny are required for to others banks',
      );
    }

    const getObjsService = container.resolve(GetObjsTransactionsService);

    const status = await getObjsService.getBankTransactionsStatusApproved();
    const typeTransaction = await getObjsService.getBankTransactionsTypeTransactionPayment();

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

    const bankTransactionPaymentOrTransferInternal = this.bankTransactionsRepository.create(
      {
        originTransaction,
        channel,
        channelDescription,
        value,
        bank_account_sender_id,
        memo,
        status,
        typeTransaction,
        compensationDate,
        bank_destiny_id,
        agencyDestiny,
        cpfDestiny,
        accountDestiny,
      },
    );

    return bankTransactionPaymentOrTransferInternal;
  }
}

export default CreatePaymentServiceExternal;
