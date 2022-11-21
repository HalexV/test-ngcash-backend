import { Request, Response } from 'express';
import CashOutAccountUseCase from './CashOutAccountUseCase';

export default class CashOutAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    const cashOutUser = request.user;
    const { cashInUsername, value } = request.body;

    const cashOutAccountUseCase = new CashOutAccountUseCase();

    await cashOutAccountUseCase.execute({
      cashInUsername,
      cashOutUser,
      value,
    });

    return response.status(200).json({
      message: 'Transfer success',
    });
  }
}
