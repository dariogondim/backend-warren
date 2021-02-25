import { Router } from 'express';
import BankTransactionsController from '../controllers/BankTransactionsController';

const bankTransactionsRouter = Router();
const bankTransactionController = new BankTransactionsController();

bankTransactionsRouter.post(
  '/deposit',
  bankTransactionController.createDeposit,
);

export default bankTransactionsRouter;
