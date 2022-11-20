/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../../src/client';
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
});
