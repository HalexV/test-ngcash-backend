/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../src/client';
import ValidationError from '../../../../../../src/errors/ValidationError';
import AuthenticateUserUseCase from '../../../../../../src/modules/user/useCases/authenticateUser/AuthenticateUserUseCase';
import bcrypt from 'bcrypt';

describe('User - Authenticate User Use Case', () => {
  beforeEach(() => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'any',
      username: 'any',
      password: 'any',
      accountId: 'any',
    });
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
  });

  it('should throw a validation error when username does not exist', async () => {
    const sut = new AuthenticateUserUseCase();

    const userDTO = {
      username: 'invalid',
      password: 'validABC2',
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

    let resultError;

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual(
      'Username or password is incorrect'
    );
  });

  it('should throw a validation error when password is incorrect', async () => {
    const sut = new AuthenticateUserUseCase();

    const userDTO = {
      username: 'valid',
      password: 'invalidABC2',
    };

    jest.spyOn(bcrypt, 'compare').mockImplementation(() => false);

    let resultError;

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual(
      'Username or password is incorrect'
    );
  });
});
