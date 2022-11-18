import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../src/client';
import ValidationError from '../../../../../../src/errors/ValidationError';
import CreateUserUseCase from '../../../../../../src/modules/user/useCases/createUser/CreateUserUseCase';
import bcrypt from 'bcrypt';

describe('User - Create User Use Case', () => {
  beforeEach(() => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    jest.spyOn(bcrypt, 'hash').mockImplementation(() => null);
  });

  it('should throw a validation error when username is less than 3 characters', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: '',
      password: 'any',
    };

    let resultError = new Error();

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual(
      'Username must be 3 characters or more'
    );
  });

  it('should throw a validation error when username already exists', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'any',
      password: 'abcdefghi5H',
    };

    const mockUser = {
      id: 'any',
      username: 'any',
      password: 'any',
      accountId: 'any',
    };

    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser);

    let resultError = new Error();

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual('Username already exists');
  });

  it('should throw a validation error when password is less than 8 characters', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'any',
      password: 'invalid',
    };

    let resultError;

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual(
      'Password must be 8 characters or more and contain a number and an uppercase letter'
    );
  });

  it('should throw a validation error when password does not contain a number', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'any',
      password: 'invalidabc',
    };

    let resultError;

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual(
      'Password must be 8 characters or more and contain a number and an uppercase letter'
    );
  });

  it('should throw a validation error when password does not contain an uppercase letter', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'any',
      password: 'invalidabc7',
    };

    let resultError;

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual(
      'Password must be 8 characters or more and contain a number and an uppercase letter'
    );
  });

  it('should call bcrypt hash to hash the password', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'valid',
      password: 'valid1ABC',
    };

    const hashSpy = jest.spyOn(bcrypt, 'hash');

    await sut.execute(userDTO);

    expect(hashSpy).toHaveBeenCalledWith(userDTO.password, 8);
  });
});
