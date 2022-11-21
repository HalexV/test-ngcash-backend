/* eslint-disable @typescript-eslint/no-misused-promises */
import { Router } from 'express';
import CreateUserController from '../modules/user/useCases/createUser/CreateUserController';

const createUserController = new CreateUserController();

const usersRoutes = Router();

usersRoutes.post('/', createUserController.handle);

export default usersRoutes;
