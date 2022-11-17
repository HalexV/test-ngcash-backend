import { describe, it, expect, jest } from '@jest/globals';
import prisma from '../../../../../../src/client';
import ValidationError from '../../../../../../src/errors/ValidationError';
import CreateUserUseCase from '../../../../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('User - Create User Use Case', () => {
  it('should not create a user when username is less than 3 characters', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: '',
      password: 'any',
    };

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toStrictEqual(
        'Username must be 3 characters or more'
      );
    }
  });

  it('should throw a validation error when username already exists', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: 'any',
      password: 'any',
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
});
