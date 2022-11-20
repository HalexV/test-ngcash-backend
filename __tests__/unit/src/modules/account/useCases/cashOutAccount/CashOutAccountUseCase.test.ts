/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../../src/client';
import NotFoundError from '../../../../../../../src/errors/NotFoundError';
import ValidationError from '../../../../../../../src/errors/ValidationError';
import CashOutAccountUseCase from '../../../../../../../src/modules/account/useCases/cashOutAccount/CashOutAccountUseCase';

describe('Account - Cash Out Account Use Case', () => {
  beforeEach(() => {
    jest.spyOn(prisma.account, 'findUnique').mockResolvedValue(null);
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
});
