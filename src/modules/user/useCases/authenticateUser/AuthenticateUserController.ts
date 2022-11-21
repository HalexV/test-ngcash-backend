import { Request, Response } from 'express';
import AuthenticateUserUseCase from './AuthenticateUserUseCase';

export default class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
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
  }
}
