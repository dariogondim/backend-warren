import ICreateDepositDTO from '@modules/bankTransactions/dtos/ICreateDepositDTO';
import ICreatePaymentOutsideDTO from '../dtos/ICreatePaymentOutsideDTO';
import ICreatePaymentDTO from '../dtos/ICreatePaymentOutsideDTO';
import ICreateWithdrawDTO from '../dtos/ICreateWithdrawDTO';
import BankTransactions from '../infra/typeorm/entities/BankTransactions';

export default interface IBankTransactionsRepository {
  create(
    data:
      | ICreateDepositDTO
      | ICreateWithdrawDTO
      | ICreatePaymentDTO
      | ICreatePaymentOutsideDTO,
  ): Promise<BankTransactions>;
  findAllByBankAccount(data: string): Promise<BankTransactions[]>;
}
