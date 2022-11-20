/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../../src/client';
import NotFoundError from '../../../../../../../src/errors/NotFoundError';
import ReadAccountBalanceUseCase from '../../../../../../../src/modules/account/useCases/readAccountBalance/ReadAccountBalanceUseCase';

describe('Account - Read Account Balance Use Case', () => {
  beforeEach(() => {
    jest.spyOn(prisma.account, 'findUnique').mockResolvedValue({
      id: 'any',
      balance: 100,
    });
  });

  it('should call prisma account find unique with correct arguments', async () => {
    const sut = new ReadAccountBalanceUseCase();

    const readAccountDTO = {
      accountId: 'any',
    };

    const expectedArguments = {
      where: {
        id: readAccountDTO.accountId,
      },
    };

    await sut.execute(readAccountDTO);

    const findUniqueSpy = jest.spyOn(prisma.account, 'findUnique');

    expect(findUniqueSpy).toHaveBeenCalledWith(expectedArguments);
  });

  it('should throw if prisma find unique throws', async () => {
    const sut = new ReadAccountBalanceUseCase();

    const readAccountDTO = {
      accountId: 'any',
    };

    jest.spyOn(prisma.account, 'findUnique').mockRejectedValue(new Error());

    const promise = sut.execute(readAccountDTO);

    await expect(promise).rejects.toThrowError();
  });

  it('should throw a not found error if account does not exist', async () => {
    const sut = new ReadAccountBalanceUseCase();

    jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(null);

    const readAccountDTO = {
      accountId: 'any',
    };

    let resultError;

    try {
      await sut.execute(readAccountDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(NotFoundError);
    expect(resultError.message).toStrictEqual('Account not found');
  });
});
