/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/client';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
  });
});
