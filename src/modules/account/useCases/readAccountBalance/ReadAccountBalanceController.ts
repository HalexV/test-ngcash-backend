import { Request, Response } from 'express';
import HttpStatus from '../../../../utils/httpStatus';
import ReadAccountBalanceUseCase from './ReadAccountBalanceUseCase';

export default class ReadAccountBalanceController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
      const { accountId } = request.user;

      const readAccountBalanceUserUseCase = new ReadAccountBalanceUseCase();

      const { balance } = await readAccountBalanceUserUseCase.execute({
        accountId,
      });

      return response.status(200).json({
        message: 'Success',
        balance,
      });
    } catch (error: any) {
      if (error.name === 'NotFoundError') {
        return response.status(HttpStatus.NOT_FOUND).json({
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
