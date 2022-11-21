import { Request, Response } from 'express';
import HttpStatus from '../../../../utils/httpStatus';
import CashOutAccountUseCase from './CashOutAccountUseCase';

export default class CashOutAccountController {
  async handle(request: Request, response: Response): Promise<Response> {
    try {
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
    } catch (error: any) {
      if (error.name === 'ValidationError') {
        return response.status(HttpStatus.BAD_REQUEST).json({
          message: error.message,
        });
      }

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
