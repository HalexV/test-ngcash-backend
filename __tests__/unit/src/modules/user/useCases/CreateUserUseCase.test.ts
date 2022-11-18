/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import prisma from '../../../../../../src/client';
import ValidationError from '../../../../../../src/errors/ValidationError';
import CreateUserUseCase from '../../../../../../src/modules/user/useCases/createUser/CreateUserUseCase';
import bcrypt from 'bcrypt';

describe('User - Create User Use Case', () => {
  beforeEach(() => {
    jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
    jest.spyOn(prisma.account, 'create').mockResolvedValue({
      id: 'anyAccountId',
      balance: 100,
    });
    jest.spyOn(prisma.user, 'create').mockResolvedValue({
      id: 'any',
      username: 'any',
      password: 'any',
      accountId: 'any',
    });
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

  it('should call prisma account nested create with correct arguments', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'valid',
      password: 'valid1ABC',
    };

    const mockHashedPassword = 'lakdsjj029340932ekdmflskd';

    const expectedArguments = {
      data: {
        user: {
          create: {
            username: userDTO.username,
            password: mockHashedPassword,
          },
        },
      },
    };

    const createSpy = jest.spyOn(prisma.account, 'create');
    jest.spyOn(bcrypt, 'hash').mockImplementation(async (): Promise<string> => {
      return await new Promise((resolve) => resolve(mockHashedPassword));
    });

    await sut.execute(userDTO);

    expect(createSpy).toBeCalledWith(expectedArguments);
  });

  it('should throw if prisma user find unique throws', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'valid',
      password: 'valid1ABC',
    };

    jest.spyOn(prisma.user, 'findUnique').mockRejectedValue(new Error());

    const promise = sut.execute(userDTO);

    await expect(promise).rejects.toThrowError();
  });

  it('should throw if prisma account nested create throws', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'valid',
      password: 'valid1ABC',
    };

    jest.spyOn(prisma.account, 'create').mockRejectedValue(new Error());

    const promise = sut.execute(userDTO);

    await expect(promise).rejects.toThrowError();
  });
});
