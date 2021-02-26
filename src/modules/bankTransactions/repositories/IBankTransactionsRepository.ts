import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import BankTransactions from '../infra/typeorm/entities/BankTransactions';

export default interface IBankTransactionsRepository {
  create(data: ICreateDepositDTO): Promise<BankTransactions>;
  findAllByBankAccount(data: string): Promise<BankTransactions[]>;
}
