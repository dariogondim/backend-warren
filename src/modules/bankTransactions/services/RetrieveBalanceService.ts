import { injectable, inject, container } from 'tsyringe';

import IBankAccountRepository from '@modules/bankAccounts/repositories/IBankAccountRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IBankTransactionsRepository from '../repositories/IBankTransactionsRepository';
import CalculateBalanceAndExtractService from './shared/CalculateBalanceAndExtractService';
import IRetrieveBankStatementDTO from '../dtos/IRetrieveBankStatementDTO';
import ValidateTransactionsService from './shared/ValidateTransactionsService';
import GetObjsTransactionsService from './shared/GetObjsTransactionsService';

interface IRequest {
  bank_account_sender_id: string; // de onde parte o saque
  user_id: string; // o id do usuário que se autenticou
  from: string;
  to: string;
}

@injectable()
class RetrieveBalanceService {
  constructor(
    @inject('BankTransactionsRepository')
    private bankTransactionsRepository: IBankTransactionsRepository,

    @inject('BankAccountRepository')
    private bankAccountRepository: IBankAccountRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute({
    bank_account_sender_id,
    user_id,
    from,
    to,
  }: IRequest): Promise<IRetrieveBankStatementDTO> {
    // bussiness rules

    const validateService = container.resolve(ValidateTransactionsService);

    if (!bank_account_sender_id) {
      throw new AppError('The bank account needs to be selected');
    }

    const getObjsService = container.resolve(GetObjsTransactionsService);

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

    const banksTransactions = await this.bankTransactionsRepository.getTransactionsForBalanceByBankAccount(
      bankAccount.id,
    );

    const calculateBalanceAndExtractService = container.resolve(
      CalculateBalanceAndExtractService,
    );

    const result = await calculateBalanceAndExtractService.execute({
      banksTransactions,
      bankAccount,
      from,
      to,
    });

    return result;
  }
}

export default RetrieveBalanceService;
