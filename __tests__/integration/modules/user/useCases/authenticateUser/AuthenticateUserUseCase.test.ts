/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals';
import prisma from '../../../../../../src/client';
import AuthenticateUserUseCase from '../../../../../../src/modules/user/useCases/authenticateUser/AuthenticateUserUseCase';
import ValidationError from '../../../../../../src/errors/ValidationError';

describe('Integration - User - Authenticate User Use Case', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterEach(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteAccounts = prisma.account.deleteMany();

    await prisma.$transaction([deleteUsers, deleteAccounts]);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should throw a validation error if username does not exist', async () => {
    const sut = new AuthenticateUserUseCase();

    const authenticateUserDTO = {
      username: 'testABC123',
      password: 'testZXC321',
    };

    let resultError;

    try {
      await sut.execute(authenticateUserDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(ValidationError);
    expect(resultError.message).toStrictEqual(
      'Username or password is incorrect'
    );
  });
});
