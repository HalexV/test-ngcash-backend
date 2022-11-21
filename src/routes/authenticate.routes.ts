/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import AuthenticateUserController from '../modules/user/useCases/authenticateUser/AuthenticateUserController';

const authenticateUserController = new AuthenticateUserController();

const authenticateRoutes = Router();

authenticateRoutes.post('/login', authenticateUserController.handle);

export default authenticateRoutes;
