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

    // date: 2020-01-01T10:00:00
    await prisma.transaction.create({
      data: {
        value: 10,
        creditedAccountId: userAccountC.id,
        debitedAccountId: userAccountB.id,
        createdAt: new Date('2020-01-01T10:00:00'),
      },
    });

    // date: 2020-01-02T00:00:00
    await prisma.transaction.create({
      data: {
        value: 10,
        creditedAccountId: userAccountC.id,
        debitedAccountId: userAccountB.id,
        createdAt: new Date('2020-01-02T00:00:00'),
      },
    });

    // date: 2020-01-02T23:59:59
    await prisma.transaction.create({
      data: {
        value: 10,
        creditedAccountId: userAccountC.id,
        debitedAccountId: userAccountB.id,
        createdAt: new Date('2020-01-02T23:59:59'),
      },
    });

    // date: 2020-01-03T00:00:00
    await prisma.transaction.create({
      data: {
        value: 10,
        creditedAccountId: userAccountC.id,
        debitedAccountId: userAccountB.id,
        createdAt: new Date('2020-01-03T00:00:00'),
      },
    });
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

    expect(transactions.length).toStrictEqual(9);
    expect(debited).toStrictEqual(7);
    expect(credited).toStrictEqual(2);
  });

  it('should list all transactions of user C', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountC.id,
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountC.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountC.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(5);
    expect(debited).toStrictEqual(0);
    expect(credited).toStrictEqual(5);
  });

  it('should list all transactions of user C on 2020-01-01', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountC.id,
      transactionDate: new Date('2020-01-01'),
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountC.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountC.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(1);
    expect(debited).toStrictEqual(0);
    expect(credited).toStrictEqual(1);
  });

  it('should list all transactions of user C on 2020-01-02', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountC.id,
      transactionDate: new Date('2020-01-02'),
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountC.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountC.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(2);
    expect(debited).toStrictEqual(0);
    expect(credited).toStrictEqual(2);
  });

  it('should list all transactions of user C on 2020-01-03', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountC.id,
      transactionDate: new Date('2020-01-03'),
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountC.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountC.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(1);
    expect(debited).toStrictEqual(0);
    expect(credited).toStrictEqual(1);
  });

  it('should list all transactions of user C on 2020-01-04', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountC.id,
      transactionDate: new Date('2020-01-04'),
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountC.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountC.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(0);
    expect(debited).toStrictEqual(0);
    expect(credited).toStrictEqual(0);
  });

  it('should list all credited transactions of user B', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountB.id,
      cashInTransactions: true,
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

    expect(transactions.length).toStrictEqual(2);
    expect(debited).toStrictEqual(0);
    expect(credited).toStrictEqual(2);
  });

  it('should list all debited transactions of user B', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountB.id,
      cashOutTransactions: true,
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

    expect(transactions.length).toStrictEqual(7);
    expect(debited).toStrictEqual(7);
    expect(credited).toStrictEqual(0);
  });

  it('should list all credited transactions of user C on 2020-01-02', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountC.id,
      cashInTransactions: true,
      transactionDate: new Date('2020-01-02'),
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountC.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountC.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(2);
    expect(debited).toStrictEqual(0);
    expect(credited).toStrictEqual(2);
  });

  it('should list all debited transactions of user C on 2020-01-02', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountC.id,
      cashOutTransactions: true,
      transactionDate: new Date('2020-01-02'),
    });

    let debited = 0;
    let credited = 0;

    transactions.forEach((transaction) => {
      if (transaction.creditedAccountId === userAccountC.id) {
        credited++;
      }

      if (transaction.debitedAccountId === userAccountC.id) {
        debited++;
      }
    });

    expect(transactions.length).toStrictEqual(0);
    expect(debited).toStrictEqual(0);
    expect(credited).toStrictEqual(0);
  });

  it('should list all transactions of user B when cash out and cash in filters are passed', async () => {
    const sut = new ListTransactionsUseCase();

    const transactions = await sut.execute({
      accountId: userAccountB.id,
      cashInTransactions: true,
      cashOutTransactions: true,
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

    expect(transactions.length).toStrictEqual(9);
    expect(debited).toStrictEqual(7);
    expect(credited).toStrictEqual(2);
  });
});
