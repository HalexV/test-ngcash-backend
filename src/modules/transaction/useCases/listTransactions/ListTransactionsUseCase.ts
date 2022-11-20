import prisma from '../../../../client';
import IListTransactionsDTO from '../../dtos/IListTransactionsDTO';

export default class ListTransactionsUseCase {
  async execute({
    accountId,
    cashInTransactions,
    cashOutTransactions,
    transactionDate,
  }: IListTransactionsDTO): Promise<void> {
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

    await prisma.transaction.findMany(query);
  }
}
