/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import accountsRoutes from './accounts.routes';
import authenticateRoutes from './authenticate.routes';
import transactionsRoutes from './transactions.routes';
import usersRoutes from './users.routes';

const router = Router();

router.get('/', (request, response) => {
  return response.json({
    safe: true,
  });
});

router.use('/users', usersRoutes);
router.use(authenticateRoutes);
router.use(ensureAuthenticated);
router.use('/accounts', accountsRoutes);
router.use('/transactions', transactionsRoutes);

export default router;
