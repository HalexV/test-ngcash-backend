/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../../src/client';
import ListTransactionsUseCase from '../../../../../../../src/modules/transaction/useCases/listTransactions/ListTransactionsUseCase';

describe('Transaction - List Transactions Use Case', () => {
  beforeEach(() => {
    jest.spyOn(prisma.transaction, 'findMany').mockResolvedValue([]);
  });

  it('should call prisma transaction find many with default query when filters are not passed', async () => {
    const sut = new ListTransactionsUseCase();

    const listTransactionsDTO = {
      accountId: 'any',
    };

    const expectedQuery = {
      where: {
        OR: [
          {
            creditedAccountId: listTransactionsDTO.accountId,
          },
          {
            debitedAccountId: listTransactionsDTO.accountId,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    const findManySpy = jest.spyOn(prisma.transaction, 'findMany');

    await sut.execute(listTransactionsDTO);

    expect(findManySpy).toHaveBeenCalledWith(expectedQuery);
  });

  it('should call prisma transaction find many with correct query when cash in filter is true', async () => {
    const sut = new ListTransactionsUseCase();

    const listTransactionsDTO = {
      accountId: 'any',
      cashInTransactions: true,
    };

    const expectedQuery = {
      where: {
        creditedAccountId: listTransactionsDTO.accountId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    const findManySpy = jest.spyOn(prisma.transaction, 'findMany');

    await sut.execute(listTransactionsDTO);

    expect(findManySpy).toHaveBeenCalledWith(expectedQuery);
  });

  it('should call prisma transaction find many with correct query when cash out filter is true', async () => {
    const sut = new ListTransactionsUseCase();

    const listTransactionsDTO = {
      accountId: 'any',
      cashOutTransactions: true,
    };

    const expectedQuery = {
      where: {
        debitedAccountId: listTransactionsDTO.accountId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    };

    const findManySpy = jest.spyOn(prisma.transaction, 'findMany');

    await sut.execute(listTransactionsDTO);

    expect(findManySpy).toHaveBeenCalledWith(expectedQuery);
  });
});
