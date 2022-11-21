/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import CashOutAccountController from '../modules/account/useCases/cashOutAccount/CashOutAccountController';
import ReadAccountBalanceController from '../modules/account/useCases/readAccountBalance/ReadAccountBalanceController';

const readAccountBalanceController = new ReadAccountBalanceController();
const cashOutAccountController = new CashOutAccountController();

const accountsRoutes = Router();

accountsRoutes.get('/balance', readAccountBalanceController.handle);
accountsRoutes.post('/transfer', cashOutAccountController.handle);

export default accountsRoutes;
