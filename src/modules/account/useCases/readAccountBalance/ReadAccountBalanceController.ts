import { Request, Response } from 'express';
import ReadAccountBalanceUseCase from './ReadAccountBalanceUseCase';

export default class ReadAccountBalanceController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { accountId } = request.user;

    const readAccountBalanceUserUseCase = new ReadAccountBalanceUseCase();

    const { balance } = await readAccountBalanceUserUseCase.execute({
      accountId,
    });

    return response.status(200).json({
      message: 'Success',
      balance,
    });
  }
}
