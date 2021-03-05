import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import ICreatePaymentDTO from '../dtos/ICreatePaymentDTO';
import ICreatePaymentOutsideDTO from '../dtos/ICreatePaymentOutsideDTO';
import ICreateWithdrawDTO from '../dtos/ICreateWithdrawDTO';
import BankTransactions from '../infra/typeorm/schemas/BankTransactions';

export default interface IBankTransactionsRepository {
  create(
    data:
      | ICreateDepositDTO
      | ICreateWithdrawDTO
      | ICreatePaymentDTO
      | ICreatePaymentOutsideDTO,
  ): Promise<BankTransactions>;
  getTransactionsForBalanceByBankAccount(
    data: string,
  ): Promise<BankTransactions[]>;
}
