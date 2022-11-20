/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect } from '@jest/globals';
import ValidationError from '../../../../../../../src/errors/ValidationError';
import CashOutAccountUseCase from '../../../../../../../src/modules/account/useCases/cashOutAccount/CashOutAccountUseCase';

describe('Account - Cash Out Account Use Case', () => {
  it('should throw a validation error when usernames are equal', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutDTO = {
      cashInUsername: 'equal',
      cashOutUsername: 'equal',
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
});
