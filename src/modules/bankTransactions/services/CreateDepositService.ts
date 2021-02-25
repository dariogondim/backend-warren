import { injectable, inject } from 'tsyringe';

// import addDays from 'date-fns/addDays';
import IBankTransactionsRepository from '../repositories/IBankTransactionsRepository';
import BankTransactions from '../infra/typeorm/entities/BankTransactions';
import { BANK_TRANSACTIONS } from '../infra/typeorm/constants/BankTransactions.constants';

interface IRequest {
  originTransaction: string;
  channel: string;
  channelDescription: string;
  value: number;
  bank_account_sender_id: string; // de onde parte o depósito
  // typeTransaction: string;
  // status: string; // gerado no service
  // compensationDate: Date; // gerado no service
  // profitability_id?: string; // pode ser nulo se nao tiver rentabilidade
}

@injectable()
class CreateDepositService {
  constructor(
    @inject('BankTransactionsRepository')
    private bankTransactionsRepository: IBankTransactionsRepository,
  ) {}

  public async execute({
    originTransaction,
    channel,
    channelDescription,
    value,
    bank_account_sender_id,
  }: IRequest): Promise<BankTransactions> {
    const status = BANK_TRANSACTIONS.status.Approved;
    const typeTransaction = BANK_TRANSACTIONS.typeTransaction.Deposit;
    const compensationDate = new Date();
    const profitability_id = 'eb85f0f2-2526-4935-b005-78d048c599f7';
    const bankTransactionDeposit = this.bankTransactionsRepository.createDeposit(
      {
        originTransaction,
        channel,
        channelDescription,
        value,
        bank_account_sender_id,
        status,
        typeTransaction,
        compensationDate,
        profitability_id,
      },
    );
    return bankTransactionDeposit;
  }
}

export default CreateDepositService;
