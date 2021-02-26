import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import { Router } from 'express';
import BankTransactionsController from '../controllers/BankTransactionsController';

const bankTransactionsRouter = Router();
const bankTransactionController = new BankTransactionsController();

bankTransactionsRouter.use(ensureAuthenticated);

bankTransactionsRouter.post(
  '/deposit',
  bankTransactionController.createDeposit,
);

bankTransactionsRouter.post(
  '/withdraw',
  bankTransactionController.createWithdraw,
);

bankTransactionsRouter.post(
  '/balance',
  bankTransactionController.calculateBalanceService,
);

export default bankTransactionsRouter;
