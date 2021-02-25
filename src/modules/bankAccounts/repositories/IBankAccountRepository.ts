import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import BankAccount from '../infra/typeorm/entities/BankAccount';

export default interface IBankAccountRepository {
  findById(id: string): Promise<BankAccount | undefined>;
}
