import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Transactional } from 'typeorm-transactional-cls-hooked';
import CreateDepositService from '@modules/bankTransactions/services/CreateDepositService';
import CreateWithdrawService from '@modules/bankTransactions/services/CreateWithdrawService';
import RetrieveBalanceService from '@modules/bankTransactions/services/RetrieveBalanceService';
import CreatePaymentService from '@modules/bankTransactions/services/CreatePaymentService';
import CreatePaymentServiceExternal from '@modules/bankTransactions/services/CreatePaymentServiceExternal';

export default class BankTransactionsController {
  @Transactional()
  public async createDeposit(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      originTransaction,
      channel,
      channelDescription,
      value,
      bank_account_sender_id,
      memo,
    } = request.body;

    const { user_id } = request.body;

    const createBankTransaction = container.resolve(CreateDepositService);

    const bankTransaction = await createBankTransaction.execute({
      originTransaction,
      channel,
      channelDescription,
      value,
      bank_account_sender_id,
      memo,
      user_id,
    });

    return response.json(bankTransaction);
  }

  public async createPayment(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      originTransaction,
      channel,
      channelDescription,
      value,
      bank_account_sender_id,
      bank_account_recipient_id,
      memo,
    } = request.body;

    const { user_id } = request.body;

    const createBankTransaction = container.resolve(CreatePaymentService);

    const bankTransaction = await createBankTransaction.execute({
      originTransaction,
      channel,
      channelDescription,
      value,
      bank_account_sender_id,
      bank_account_recipient_id,
      memo,
      user_id,
    });

    return response.json(bankTransaction);
  }

  public async createPaymentOutside(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
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
    } = request.body;

    const { user_id } = request.body;

    const createBankTransaction = container.resolve(
      CreatePaymentServiceExternal,
    );

    const bankTransaction = await createBankTransaction.execute({
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
    });

    return response.json(bankTransaction);
  }

  public async createWithdraw(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const {
      channel,
      channelDescription,
      value,
      bank_account_sender_id,
      memo,
    } = request.body;

    const { user_id } = request.body;

    const createBankTransaction = container.resolve(CreateWithdrawService);

    const bankTransaction = await createBankTransaction.execute({
      channel,
      channelDescription,
      value,
      bank_account_sender_id,
      memo,
      user_id,
    });

    return response.json(bankTransaction);
  }

  public async calculateBalanceService(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { bank_account_sender_id, from, to } = request.body;

    const { user_id } = request.body;

    const createBankTransaction = container.resolve(RetrieveBalanceService);

    const bankTransaction = await createBankTransaction.execute({
      bank_account_sender_id,
      user_id,
      from,
      to,
    });

    return response.json(bankTransaction);
  }
}
