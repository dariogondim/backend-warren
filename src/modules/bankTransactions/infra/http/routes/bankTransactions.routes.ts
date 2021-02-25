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

export default bankTransactionsRouter;
