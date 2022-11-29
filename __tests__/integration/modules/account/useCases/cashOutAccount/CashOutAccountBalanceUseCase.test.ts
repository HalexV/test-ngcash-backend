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
import CashOutAccountUseCase from '../../../../../../src/modules/account/useCases/cashOutAccount/CashOutAccountUseCase';
import CreateUserUseCase from '../../../../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Integration - Account - Cash Out Account Use Case', () => {
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

  it('should throw a not found error if cash out account does not exist', async () => {
    const sut = new CashOutAccountUseCase();

    const cashOutUser = {
      username: 'whatever',
      accountId: 'invalid',
    };

    const cashOutAccountDTO = {
      cashInUsername: 'any',
      cashOutUser,
      value: 40,
    };

    let resultError;

    try {
      await sut.execute(cashOutAccountDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(NotFoundError);
    expect(resultError.message).toStrictEqual('Cash out account not found');
  });

  it('should throw a not found error if cash in username does not exist', async () => {
    const createUser = new CreateUserUseCase();
    const sut = new CashOutAccountUseCase();

    const createUserDTO = {
      username: 'testABC123',
      password: 'testCBA321',
    };

    await createUser.execute(createUserDTO);

    const cashOutUser = (await prisma.user.findUnique({
      where: {
        username: createUserDTO.username,
      },
    })) as User;

    const cashOutAccountDTO = {
      cashInUsername: 'invalid',
      cashOutUser,
      value: 40,
    };

    let resultError;

    try {
      await sut.execute(cashOutAccountDTO);
    } catch (error: any) {
      resultError = error;
    }

    expect(resultError).toBeInstanceOf(NotFoundError);
    expect(resultError.message).toStrictEqual(
      'Cash in username does not exist'
    );
  });
});
