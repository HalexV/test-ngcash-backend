/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import ListTransactionsController from '../modules/transaction/useCases/listTransactions/ListTransactionsController';

const listTransactionsController = new ListTransactionsController();

const transactionsRoutes = Router();

transactionsRoutes.get('/', listTransactionsController.handle);

export default transactionsRoutes;
