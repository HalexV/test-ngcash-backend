/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals';
import { User } from '@prisma/client';
import prisma from '../../../../../../src/client';
import NotFoundError from '../../../../../../src/errors/NotFoundError';
import ReadAccountBalanceUseCase from '../../../../../../src/modules/account/useCases/readAccountBalance/ReadAccountBalanceUseCase';
import CreateUserUseCase from '../../../../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Integration - Account - Read Account Balance Use Case', () => {
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

  it('should throw a not found error if account does not exist', async () => {
    const sut = new ReadAccountBalanceUseCase();

    const accountId = 'invalid';

    let resultError;

    try {
      await sut.execute({
        accountId,
      });
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(NotFoundError);
    expect(resultError.message).toStrictEqual('Account not found');
  });

  it("should return user's account balance", async () => {
    const createUser = new CreateUserUseCase();
    const sut = new ReadAccountBalanceUseCase();

    const createUserDTO = {
      username: 'testABC123',
      password: 'testZXC321',
    };

    const expectedResult = {
      balance: 100,
    };

    await createUser.execute(createUserDTO);

    const { accountId } = (await prisma.user.findUnique({
      where: {
        username: createUserDTO.username,
      },
    })) as User;

    const result = await sut.execute({
      accountId,
    });

    expect(result).toEqual(expectedResult);
  });
});
