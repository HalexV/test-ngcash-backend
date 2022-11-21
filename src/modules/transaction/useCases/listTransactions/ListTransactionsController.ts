import { Request, Response } from 'express';
import ListTransactionsUseCase from './ListTransactionsUseCase';

export default class ListTransactionsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { accountId } = request.user;
    const { cashInTransactions, cashOutTransactions, transactionDate } =
      request.query;

    const params = {
      accountId,
    };

    if (cashInTransactions != null) {
      let bool;
      if (cashInTransactions === 'false') {
        bool = false;
      } else {
        if (cashInTransactions === 'true') {
          bool = true;
          Object.assign(params, {
            cashInTransactions: bool,
          });
        }
      }
    }

    if (cashOutTransactions != null) {
      let bool;
      if (cashOutTransactions === 'false') {
        bool = false;
      } else {
        if (cashOutTransactions === 'true') {
          bool = true;
          Object.assign(params, {
            cashOutTransactions: bool,
          });
        }
      }
    }

    if (transactionDate != null) {
      const date = new Date(transactionDate as string);

      if (date.toString() !== 'Invalid Date') {
        Object.assign(params, {
          transactionDate: date,
        });
      }
    }

    const listTransactionsUseCase = new ListTransactionsUseCase();

    const transactions = await listTransactionsUseCase.execute(params);

    return response.status(200).json({
      transactions,
    });
  }
}
