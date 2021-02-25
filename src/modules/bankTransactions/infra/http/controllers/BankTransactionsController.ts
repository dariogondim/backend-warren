import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { Transactional } from 'typeorm-transactional-cls-hooked';
import CreateDepositService from '@modules/bankTransactions/services/CreateDepositService';

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
    } = request.body;

    const createBankTransaction = container.resolve(CreateDepositService);

    const bankTransaction = await createBankTransaction.execute({
      originTransaction,
      channel,
      channelDescription,
      value,
      bank_account_sender_id,
    });

    return response.json(bankTransaction);
  }
}
