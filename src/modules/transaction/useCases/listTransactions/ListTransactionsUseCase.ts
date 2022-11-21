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

    if (cashInTransactions != null && cashOutTransactions == null) {
      query.where = {
        creditedAccountId: accountId,
      };
    }

    if (cashOutTransactions != null && cashInTransactions == null) {
      query.where = {
        debitedAccountId: accountId,
      };
    }

    if (transactionDate != null) {
      query.where = Object.assign(query.where, {
        createdAt: transactionDate,
      });
    }

    return await prisma.transaction.findMany(query);
  }
}
