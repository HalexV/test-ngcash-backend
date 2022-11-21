import { Request, Response } from 'express';
import HttpStatus from '../../../../utils/httpStatus';
import AuthenticateUserUseCase from './AuthenticateUserUseCase';

export default class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { username, password } = request.body;

      const authenticateUserUseCase = new AuthenticateUserUseCase();

      const { token } = await authenticateUserUseCase.execute({
        username,
        password,
      });

      return response.status(200).json({
        message: 'Login success',
        token,
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
