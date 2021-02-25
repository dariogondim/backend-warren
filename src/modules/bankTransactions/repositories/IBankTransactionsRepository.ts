import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import BankTransactions from '../infra/typeorm/entities/BankTransactions';

export default interface IBankTransactionsRepository {
  createDeposit(data: ICreateDepositDTO): Promise<BankTransactions>;
}
