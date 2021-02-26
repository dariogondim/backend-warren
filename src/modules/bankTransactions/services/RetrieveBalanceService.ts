import { injectable, inject, container } from 'tsyringe';

import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import IBankAccountRepository from '@modules/bankAccounts/repositories/IBankAccountRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import AppError from '@shared/errors/AppError';
import IBankTransactionsRepository from '../repositories/IBankTransactionsRepository';
import CalculateBalanceAndExtractService from './shared/CalculateBalanceAndExtractService';
import IRetrieveBankStatementDTO from '../dtos/IRetrieveBankStatementDTO';

function hasBankAccountSenderId(bank_account_sender_id: string) {
  return bank_account_sender_id;
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

    if (!hasBankAccountSenderId(bank_account_sender_id)) {
      throw new AppError('The bank account needs to be selected');
    }

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

    const banksTransactions = await this.bankTransactionsRepository.findAllByBankAccount(
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
