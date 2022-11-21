import { Request, Response } from 'express';
import CreateUserUseCase from './CreateUserUseCase';

export default class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    const createUserUseCase = new CreateUserUseCase();

    await createUserUseCase.execute({
      username,
      password,
    });

    return response.status(201).json({
      message: 'User created',
    });
  }
}
