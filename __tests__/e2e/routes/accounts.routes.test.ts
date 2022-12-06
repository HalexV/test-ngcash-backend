/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/client';
import NotFoundError from '../../../src/errors/NotFoundError';
import ReadAccountBalanceUseCase from '../../../src/modules/account/useCases/readAccountBalance/ReadAccountBalanceUseCase';
import AuthenticateUserUseCase from '../../../src/modules/user/useCases/authenticateUser/AuthenticateUserUseCase';
import CreateUserUseCase from '../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Routes - Accounts', () => {
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

  beforeAll(async () => {
    await prisma.$connect();
    const createUser = new CreateUserUseCase();
    const authenticateUser = new AuthenticateUserUseCase();

    await createUser.execute(createUserDTO);
    await createUser.execute(createUserDTO2);

    userToken = (await authenticateUser.execute(createUserDTO)).token;
    userToken2 = (await authenticateUser.execute(createUserDTO2)).token;
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

  describe('GET /accounts/balance', () => {
    it('should return 200 and balance on success', async () => {
      const body = {
        username: 'testABC123',
        password: 'testBCA321',
      };

      const loginResponse = await request(app).post('/login').send(body);

      const token: string = loginResponse.body.token;

      const authorizationValue = `Bearer ${token}`;

      const balanceResponse = await request(app)
        .get('/accounts/balance')
        .set('authorization', authorizationValue);

      expect(balanceResponse.statusCode).toStrictEqual(200);
      expect(balanceResponse.body.message).toStrictEqual('Success');
      expect(balanceResponse.body.balance).toStrictEqual(100);
    });

    it('should return 404 when a not found error occurs', async () => {
      jest
        .spyOn(ReadAccountBalanceUseCase.prototype, 'execute')
        .mockRejectedValueOnce(new NotFoundError('test'));

      const response = await request(app)
        .get('/accounts/balance')
        .set('authorization', `Bearer ${userToken}`);

      expect(response.statusCode).toStrictEqual(404);
      expect(response.body.message).toStrictEqual('test');
    });
  });

  describe('POST /accounts/transfer', () => {
    it('should return 400 when trying to transfer to yourself', async () => {
      const body = {
        cashInUsername: createUserDTO.username,
        value: 50,
      };
      const response = await request(app)
        .post('/accounts/transfer')
        .set('authorization', `Bearer ${userToken}`)
        .send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual(
        'Cash out to yourself invalid'
      );
    });

    it('should return 400 when balance is insufficient', async () => {
      const body = {
        cashInUsername: createUserDTO2.username,
        value: 101,
      };
      const response = await request(app)
        .post('/accounts/transfer')
        .set('authorization', `Bearer ${userToken}`)
        .send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual('Balance insufficient');
    });

    it('should return 404 when cash in username does not exist', async () => {
      const body = {
        cashInUsername: 'invalid123A',
        value: 50,
      };
      const response = await request(app)
        .post('/accounts/transfer')
        .set('authorization', `Bearer ${userToken}`)
        .send(body);

      expect(response.statusCode).toStrictEqual(404);
      expect(response.body.message).toStrictEqual(
        'Cash in username does not exist'
      );
    });

    it('should return 200 on success', async () => {
      const body = {
        cashInUsername: createUserDTO2.username,
        value: 50,
      };
      const response = await request(app)
        .post('/accounts/transfer')
        .set('authorization', `Bearer ${userToken}`)
        .send(body);

      const userBalanceResponse = await request(app)
        .get('/accounts/balance')
        .set('authorization', `Bearer ${userToken}`);

      const userBalanceResponse2 = await request(app)
        .get('/accounts/balance')
        .set('authorization', `Bearer ${userToken2}`);

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.message).toStrictEqual('Transfer success');
      expect(userBalanceResponse.body.balance).toStrictEqual(50);
      expect(userBalanceResponse2.body.balance).toStrictEqual(150);
    });
  });
});
