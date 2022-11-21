import { Transaction } from '@prisma/client';
import prisma from '../../../../client';
import IListTransactionsDTO from '../../dtos/IListTransactionsDTO';

export default class ListTransactionsUseCase {
  async execute({
    accountId,
    cashInTransactions,
    cashOutTransactions,
    transactionDate,
  }: IListTransactionsDTO): Promise<Transaction[]> {
    const query: any = {
      where: {
        OR: [
          {
            creditedAccountId: accountId,
          },
          {
            debitedAccountId: accountId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    if (
      cashInTransactions != null &&
      cashInTransactions === true &&
      (cashOutTransactions == null || cashOutTransactions === false)
    ) {
      query.where = {
        creditedAccountId: accountId,
      };
    }

    if (
      cashOutTransactions != null &&
      cashOutTransactions === true &&
      (cashInTransactions == null || cashInTransactions === false)
    ) {
      query.where = {
        debitedAccountId: accountId,
      };
    }

    if (transactionDate != null) {
      const initialDay = new Date(transactionDate.getTime());
      const finalDay = new Date(transactionDate.getTime());

      initialDay.setUTCHours(0, 0, 0, 0);
      finalDay.setUTCHours(23, 59, 59, 999);

      query.where = Object.assign(query.where, {
        createdAt: {
          gte: initialDay,
          lte: finalDay,
        },
      });
    }

    return await prisma.transaction.findMany(query);
  }
}
