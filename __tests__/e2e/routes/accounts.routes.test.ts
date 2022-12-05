/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/client';
import CreateUserUseCase from '../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Routes - Accounts', () => {
  beforeAll(async () => {
    await prisma.$connect();
    const createUser = new CreateUserUseCase();

    const createUserDTO = {
      username: 'testABC123',
      password: 'testBCA321',
    };

    await createUser.execute(createUserDTO);
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteAccounts = prisma.account.deleteMany();

    await prisma.$transaction([deleteUsers, deleteAccounts]);

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
  });
});
