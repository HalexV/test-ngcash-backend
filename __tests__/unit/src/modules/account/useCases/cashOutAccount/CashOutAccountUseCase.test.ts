/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../../src/client';
import NotFoundError from '../../../../../../../src/errors/NotFoundError';
import ValidationError from '../../../../../../../src/errors/ValidationError';
import CashOutAccountUseCase from '../../../../../../../src/modules/account/useCases/cashOutAccount/CashOutAccountUseCase';

describe('Account - Cash Out Account Use Case', () => {
  beforeEach(() => {
    jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prisma.account, 'update').mockResolvedValue({
      id: 'any',
      balance: 100,
    });
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
  });

  it('should throw a validation error when usernames are equal', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutDTO = {
      cashInUsername: 'equal',
      cashOutUser: {
        username: 'equal',
        accountId: 'any',
      },
      value: 10,
    };

    let resultError;

    try {
      await sut.execute(cashOutDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual('Cash out to yourself invalid');
  });

  it('should throw a not found error when cash out account does not exist', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutDTO = {
      cashInUsername: 'random',
      cashOutUser: {
        username: 'any',
        accountId: 'any',
      },
      value: 10,
    };

    let resultError;

    try {
      await sut.execute(cashOutDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(NotFoundError);
    expect(resultError.message).toStrictEqual('Cash out account not found');
  });

  it('should throw a validation error when value is greater than balance', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutDTO = {
      cashInUsername: 'random',
      cashOutUser: {
        username: 'any',
        accountId: 'any',
      },
      value: 101,
    };

    jest.spyOn(prisma.account, 'findUnique').mockResolvedValueOnce({
      id: 'any',
      balance: 100,
    });

    let resultError;

    try {
      await sut.execute(cashOutDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual('Balance insufficient');
  });

  it('should throw a not found error when cash in user does not exist', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutDTO = {
      cashInUsername: 'random',
      cashOutUser: {
        username: 'any',
        accountId: 'any',
      },
      value: 10,
    };

    jest.spyOn(prisma.account, 'findUnique').mockResolvedValueOnce({
      id: 'any',
      balance: 100,
    });

    let resultError;

    try {
      await sut.execute(cashOutDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(NotFoundError);
    expect(resultError.message).toStrictEqual(
      'Cash in username does not exist'
    );
  });

  it('should throw a not found error when cash in account does not exist', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutDTO = {
      cashInUsername: 'random',
      cashOutUser: {
        username: 'any',
        accountId: 'any',
      },
      value: 10,
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 'any',
      username: 'random',
      password: 'any',
      accountId: 'any',
    });
    jest
      .spyOn(prisma.account, 'findUnique')
      .mockResolvedValueOnce({
        id: 'any',
        balance: 100,
      })
      .mockResolvedValueOnce(null);

    let resultError;

    try {
      await sut.execute(cashOutDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(NotFoundError);
    expect(resultError.message).toStrictEqual('Cash in account not found');
  });

  it('should call prisma account update to cash out account with correct arguments', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutDTO = {
      cashInUsername: 'random',
      cashOutUser: {
        username: 'any',
        accountId: 'any',
      },
      value: 10,
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 'any',
      username: 'random',
      password: 'any',
      accountId: 'any',
    });
    jest
      .spyOn(prisma.account, 'findUnique')
      .mockResolvedValueOnce({
        id: 'any',
        balance: 100,
      })
      .mockResolvedValueOnce({
        id: 'random',
        balance: 100,
      });

    const expectedArgument = {
      where: {
        id: 'any',
      },
      data: {
        balance: 90,
      },
    };

    const updateSpy = jest.spyOn(prisma.account, 'update');

    await sut.execute(cashOutDTO);

    expect(updateSpy).toHaveBeenNthCalledWith(1, expectedArgument);
  });

  it('should call prisma account update to cash in account with correct arguments', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutDTO = {
      cashInUsername: 'random',
      cashOutUser: {
        username: 'any',
        accountId: 'any',
      },
      value: 10,
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValueOnce({
      id: 'any',
      username: 'random',
      password: 'any',
      accountId: 'any',
    });
    jest
      .spyOn(prisma.account, 'findUnique')
      .mockResolvedValueOnce({
        id: 'any',
        balance: 100,
      })
      .mockResolvedValueOnce({
        id: 'random',
        balance: 100,
      });

    const expectedArgument = {
      where: {
        id: 'random',
      },
      data: {
        balance: 110,
      },
    };

    const updateSpy = jest.spyOn(prisma.account, 'update');

    await sut.execute(cashOutDTO);

    expect(updateSpy).toHaveBeenNthCalledWith(2, expectedArgument);
  });
});
