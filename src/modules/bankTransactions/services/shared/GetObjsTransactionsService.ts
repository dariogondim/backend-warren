import { injectable } from 'tsyringe';

import IBankAccountRepository from '@modules/bankAccounts/repositories/IBankAccountRepository';
import { BANK_TRANSACTIONS } from '@modules/bankTransactions/infra/typeorm/constants/BankTransactions.constants';
import BankAccount from '@modules/bankAccounts/infra/typeorm/entities/BankAccount';
import moment from 'moment';
import BankTransactions from '@modules/bankTransactions/infra/typeorm/schemas/BankTransactions';

@injectable()
class GetObjsTransactionsService {
  public async getBankTransactionsStatusApproved(): Promise<string> {
    return BANK_TRANSACTIONS.status.Approved;
  }

  public async getBankTransactionsTypeTransactionDeposit(): Promise<string> {
    return BANK_TRANSACTIONS.typeTransaction.Deposit;
  }

  public async getBankTransactionsTypeTransactionPayment(): Promise<string> {
    return BANK_TRANSACTIONS.typeTransaction.Payment;
  }

  public async getBankTransactionsTypeTransactionWithdraw(): Promise<string> {
    return BANK_TRANSACTIONS.typeTransaction.Withdraw;
  }

  public async getOriginTransactionTedForWithdraw(): Promise<string> {
    return BANK_TRANSACTIONS.originTransaction.Ted;
  }

  public async getCompensationDate(
    bankTransaction: Partial<BankTransactions>,
  ): Promise<Date> {
    // se for saque, compense imediatamente
    if (
      bankTransaction.typeTransaction ===
      BANK_TRANSACTIONS.typeTransaction.Withdraw
    ) {
      return moment().toDate(); // compensa tão cedo quanto possível
    }

    if (
      bankTransaction.originTransaction ===
      BANK_TRANSACTIONS.originTransaction.Doc
    ) {
      return moment().add(1, 'day').toDate(); // compensa no dia seguinte
    }
    if (
      bankTransaction.originTransaction ===
      BANK_TRANSACTIONS.originTransaction.Ted
    ) {
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

  public async getBankAccountObject(
    bank_account_sender_id: string,
    bankAccountRepository: IBankAccountRepository,
  ): Promise<BankAccount | undefined> {
    const bankAccount = await bankAccountRepository.findById(
      bank_account_sender_id,
    );
    return bankAccount;
  }

  // monetiza os valores
  public getMonetizedValue(
    valueToMonetize: number,
    tax: number,
    dtRefBalance: Date,
  ): number {
    if (
      valueToMonetize > 0 &&
      this.checkCompensateDateMonetizing(dtRefBalance)
    ) {
      return valueToMonetize * tax;
    }
    return 0;
  }

  checkCompensateDateMonetizing(
    dtMonetizing: Date,
    periodMonetizing = 1,
    limitDaysMonetizingBefore = 1,
  ): boolean {
    const dtMonetizingM = moment(dtMonetizing)
      .add(periodMonetizing, 'day')
      .startOf('day');
    // ex. se hoje é 26, monetiza todos os saldos até o final do dia 24
    const limit = moment()
      .subtract(limitDaysMonetizingBefore, 'day')
      .endOf('day');
    return dtMonetizingM.isSameOrBefore(limit);
  }
}

export default GetObjsTransactionsService;
