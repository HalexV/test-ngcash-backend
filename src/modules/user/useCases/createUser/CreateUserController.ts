import { Request, Response } from 'express';
import HttpStatus from '../../../../utils/httpStatus';
import CreateUserUseCase from './CreateUserUseCase';

export default class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { username, password } = request.body;

      const createUserUseCase = new CreateUserUseCase();

      await createUserUseCase.execute({
        username,
        password,
      });

      return response.status(201).json({
        message: 'User created',
      });
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }

      console.log(error);
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Internal Server Error',
      });
    }
  }
}
