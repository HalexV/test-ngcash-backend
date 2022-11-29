/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals';
import prisma from '../../../../../../src/client';
import NotFoundError from '../../../../../../src/errors/NotFoundError';
import ReadAccountBalanceUseCase from '../../../../../../src/modules/account/useCases/readAccountBalance/ReadAccountBalanceUseCase';

describe('Integration - Account - Read Account Balance Use Case', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterEach(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteAccounts = prisma.account.deleteMany();

    await prisma.$transaction([deleteUsers, deleteAccounts]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should throw a not found error if account does not exist', async () => {
    const sut = new ReadAccountBalanceUseCase();

    const accountId = 'invalid';

    let resultError;

    try {
      await sut.execute({
        accountId,
      });
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(NotFoundError);
    expect(resultError.message).toStrictEqual('Account not found');
  });
});
