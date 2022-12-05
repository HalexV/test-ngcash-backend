/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll } from '@jest/globals';
import { Transaction, User } from '@prisma/client';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/client';
import AuthenticateUserUseCase from '../../../src/modules/user/useCases/authenticateUser/AuthenticateUserUseCase';
import CreateUserUseCase from '../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Routes - Transactions', () => {
  const createUserDTO = {
    username: 'testABC123',
    password: 'testBCA321',
  };

  const createUserDTO2 = {
    username: 'testABC456',
    password: 'testBCA321',
  };

  let userToken: string;
  let userToken2: string;
  let user: User;
  let user2: User;

  beforeAll(async () => {
    await prisma.$connect();
    const createUser = new CreateUserUseCase();
    const authenticateUser = new AuthenticateUserUseCase();

    await createUser.execute(createUserDTO);
    await createUser.execute(createUserDTO2);

    userToken = (await authenticateUser.execute(createUserDTO)).token;
    userToken2 = (await authenticateUser.execute(createUserDTO2)).token;

    user = (await prisma.user.findUnique({
      where: {
        username: createUserDTO.username,
      },
    })) as User;

    user2 = (await prisma.user.findUnique({
      where: {
        username: createUserDTO2.username,
      },
    })) as User;

    // user transfer 10 to user 2
    await request(app)
      .post('/accounts/transfer')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        cashInUsername: createUserDTO2.username,
        value: 10,
      });
    // user transfer 20 to user 2
    await request(app)
      .post('/accounts/transfer')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        cashInUsername: createUserDTO2.username,
        value: 20,
      });
    // user 2 transfer 10 to user
    await request(app)
      .post('/accounts/transfer')
      .set('authorization', `Bearer ${userToken2}`)
      .send({
        cashInUsername: createUserDTO.username,
        value: 10,
      });
    // user transfer 30 to user 2
    await request(app)
      .post('/accounts/transfer')
      .set('authorization', `Bearer ${userToken}`)
      .send({
        cashInUsername: createUserDTO2.username,
        value: 30,
      });
    // user 2 transfer 30 to user
    await request(app)
      .post('/accounts/transfer')
      .set('authorization', `Bearer ${userToken2}`)
      .send({
        cashInUsername: createUserDTO.username,
        value: 30,
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

  describe('GET /transactions', () => {
    it('should return 200 and transactions without filters', async () => {
      const response = await request(app)
        .get('/transactions')
        .set('authorization', `Bearer ${userToken}`);

      const response2 = await request(app)
        .get('/transactions')
        .set('authorization', `Bearer ${userToken2}`);

      const userTransactions: Transaction[] = response.body.transactions;
      const user2Transactions: Transaction[] = response2.body.transactions;

      let userDebited = 0;
      let userCredited = 0;
      let user2Debited = 0;
      let user2Credited = 0;

      userTransactions.forEach((transaction) => {
        if (transaction.creditedAccountId === user.accountId) {
          userCredited++;
        }

        if (transaction.debitedAccountId === user.accountId) {
          userDebited++;
        }
      });

      user2Transactions.forEach((transaction) => {
        if (transaction.creditedAccountId === user2.accountId) {
          user2Credited++;
        }

        if (transaction.debitedAccountId === user2.accountId) {
          user2Debited++;
        }
      });

      expect(response.statusCode).toStrictEqual(200);
      expect(userCredited).toStrictEqual(2);
      expect(userDebited).toStrictEqual(3);
      expect(userTransactions.length).toStrictEqual(5);
      expect(response2.statusCode).toStrictEqual(200);
      expect(user2Credited).toStrictEqual(3);
      expect(user2Debited).toStrictEqual(2);
      expect(user2Transactions.length).toStrictEqual(5);
    });

    it('should return 200 and only cash in transactions', async () => {
      const response = await request(app)
        .get('/transactions?cashInTransactions=true')
        .set('authorization', `Bearer ${userToken}`);

      const response2 = await request(app)
        .get('/transactions?cashInTransactions=true')
        .set('authorization', `Bearer ${userToken2}`);

      const userTransactions: Transaction[] = response.body.transactions;
      const user2Transactions: Transaction[] = response2.body.transactions;

      let userDebited = 0;
      let userCredited = 0;
      let user2Debited = 0;
      let user2Credited = 0;

      userTransactions.forEach((transaction) => {
        if (transaction.creditedAccountId === user.accountId) {
          userCredited++;
        }

        if (transaction.debitedAccountId === user.accountId) {
          userDebited++;
        }
      });

      user2Transactions.forEach((transaction) => {
        if (transaction.creditedAccountId === user2.accountId) {
          user2Credited++;
        }

        if (transaction.debitedAccountId === user2.accountId) {
          user2Debited++;
        }
      });

      expect(response.statusCode).toStrictEqual(200);
      expect(userCredited).toStrictEqual(2);
      expect(userDebited).toStrictEqual(0);
      expect(userTransactions.length).toStrictEqual(2);
      expect(response2.statusCode).toStrictEqual(200);
      expect(user2Credited).toStrictEqual(3);
      expect(user2Debited).toStrictEqual(0);
      expect(user2Transactions.length).toStrictEqual(3);
    });

    it('should return 200 and only cash out transactions', async () => {
      const response = await request(app)
        .get('/transactions?cashOutTransactions=true')
        .set('authorization', `Bearer ${userToken}`);

      const response2 = await request(app)
        .get('/transactions?cashOutTransactions=true')
        .set('authorization', `Bearer ${userToken2}`);

      const userTransactions: Transaction[] = response.body.transactions;
      const user2Transactions: Transaction[] = response2.body.transactions;

      let userDebited = 0;
      let userCredited = 0;
      let user2Debited = 0;
      let user2Credited = 0;

      userTransactions.forEach((transaction) => {
        if (transaction.creditedAccountId === user.accountId) {
          userCredited++;
        }

        if (transaction.debitedAccountId === user.accountId) {
          userDebited++;
        }
      });

      user2Transactions.forEach((transaction) => {
        if (transaction.creditedAccountId === user2.accountId) {
          user2Credited++;
        }

        if (transaction.debitedAccountId === user2.accountId) {
          user2Debited++;
        }
      });

      expect(response.statusCode).toStrictEqual(200);
      expect(userCredited).toStrictEqual(0);
      expect(userDebited).toStrictEqual(3);
      expect(userTransactions.length).toStrictEqual(3);
      expect(response2.statusCode).toStrictEqual(200);
      expect(user2Credited).toStrictEqual(0);
      expect(user2Debited).toStrictEqual(2);
      expect(user2Transactions.length).toStrictEqual(2);
    });
  });
});
