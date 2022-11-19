/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../src/client';
import ValidationError from '../../../../../../src/errors/ValidationError';
import AuthenticateUserUseCase from '../../../../../../src/modules/user/useCases/authenticateUser/AuthenticateUserUseCase';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('User - Authenticate User Use Case', () => {
  const mockReturnedToken =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  beforeEach(() => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({
      id: 'any',
      username: 'any',
      password: 'any',
      accountId: 'any',
    });
    jest.spyOn(bcrypt, 'compare').mockImplementation(() => true);
    jest.spyOn(jwt, 'sign').mockImplementation(() => mockReturnedToken);
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

  it('should call jwt sign with correct arguments', async () => {
    const sut = new AuthenticateUserUseCase();

    const userDTO = {
      username: 'any',
      password: 'validABC2',
    };

    const signSpy = jest.spyOn(jwt, 'sign');

    const expectedSecret = 'any';

    const expectedPayload = {
      id: userDTO.username,
    };

    const expectedOptions = {
      expiresIn: '1d',
    };

    await sut.execute(userDTO);

    expect(signSpy).toHaveBeenCalledWith(
      expectedPayload,
      expectedSecret,
      expectedOptions
    );
  });

  it('should return an access token on success', async () => {
    const sut = new AuthenticateUserUseCase();

    const userDTO = {
      username: 'any',
      password: 'any',
    };

    const expectedResult = {
      token: mockReturnedToken,
    };

    const result = await sut.execute(userDTO);

    expect(result).toEqual(expectedResult);
  });
});
