/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-misused-promises */
import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from '@jest/globals';
import { Account, User } from '@prisma/client';
import prisma from '../../../../../../src/client';
import CashOutAccountUseCase from '../../../../../../src/modules/account/useCases/cashOutAccount/CashOutAccountUseCase';
import ListTransactionsUseCase from '../../../../../../src/modules/transaction/useCases/listTransactions/ListTransactionsUseCase';
import CreateUserUseCase from '../../../../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Integration - Transaction - List Transactions Use Case', () => {
  let userAccountB: Account, userAccountA: Account, userAccountC: Account;

  beforeAll(async () => {
    await prisma.$connect();

    const createUser = new CreateUserUseCase();
    const cashOut = new CashOutAccountUseCase();

    const createUserDTO = {
      username: 'testABC123',
      password: 'testCBA321',
    };

    const createUserDTO2 = {
      username: 'testZXC123',
      password: 'testCBA321',
    };

    const createUserDTO3 = {
      username: 'testQWE123',
      password: 'testCBA321',
    };

    await createUser.execute(createUserDTO);
    await createUser.execute(createUserDTO2);
    await createUser.execute(createUserDTO3);

    const userA = (await prisma.user.findUnique({
      where: {
        username: createUserDTO.username,
      },
    })) as User;

    const userB = (await prisma.user.findUnique({
      where: {
        username: createUserDTO2.username,
      },
    })) as User;

    const userC = (await prisma.user.findUnique({
      where: {
        username: createUserDTO3.username,
      },
    })) as User;

    userAccountB = (await prisma.account.findUnique({
      where: {
        id: userB.accountId,
      },
    })) as Account;

    userAccountA = (await prisma.account.findUnique({
      where: {
        id: userA.accountId,
      },
    })) as Account;

    userAccountC = (await prisma.account.findUnique({
      where: {
        id: userC.accountId,
      },
    })) as Account;

    // transfer 40 to userB
    let cashOutAccountDTO = {
      cashInUsername: userB.username,
      cashOutUser: userA,
      value: 40,
    };

    await cashOut.execute(cashOutAccountDTO);

    // transfer 10 to userB
    cashOutAccountDTO = {
      cashInUsername: userB.username,
      cashOutUser: userA,
      value: 10,
    };

    await cashOut.execute(cashOutAccountDTO);

    // transfer 50 to userA
    cashOutAccountDTO = {
      cashInUsername: userA.username,
      cashOutUser: userB,
      value: 50,
    };

    await cashOut.execute(cashOutAccountDTO);

    // transfer 10 to userA
    cashOutAccountDTO = {
      cashInUsername: userA.username,
      cashOutUser: userB,
      value: 10,
    };

    await cashOut.execute(cashOutAccountDTO);

    // transfer 20 to userC
    cashOutAccountDTO = {
      cashInUsername: userC.username,
      cashOutUser: userB,
      value: 20,
    };

    await cashOut.execute(cashOutAccountDTO);
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteAccounts = prisma.account.deleteMany();
    const deleteTransactions = prisma.transaction.deleteMany();

    await prisma.$transaction([
      deleteTransactions,
      deleteUsers,
      deleteAccounts,
    ]);
    await prisma.$disconnect();
  });

  it('should list all transactions of user A', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountA.id,
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountA.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountA.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(4);
    expect(debited).toStrictEqual(2);
    expect(credited).toStrictEqual(2);
  });

  it('should list all transactions of user B', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountB.id,
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountB.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountB.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(5);
    expect(debited).toStrictEqual(3);
    expect(credited).toStrictEqual(2);
  });
});
