/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll, jest } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/client';
import AuthenticateUserUseCase from '../../../src/modules/user/useCases/authenticateUser/AuthenticateUserUseCase';
import CreateUserUseCase from '../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Routes - Authenticate', () => {
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

  describe('POST /login', () => {
    it('should return 400 when username does not exist', async () => {
      const body = {
        username: 'invalid',
        password: 'valiD123',
      };

      const response = await request(app).post('/login').send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual(
        'Username or password is incorrect'
      );
    });

    it('should return 400 when password is incorrect', async () => {
      const body = {
        username: 'testABC123',
        password: 'invaliD123',
      };

      const response = await request(app).post('/login').send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual(
        'Username or password is incorrect'
      );
    });

    it('should return 500 when a not mapped error occurs', async () => {
      jest
        .spyOn(AuthenticateUserUseCase.prototype, 'execute')
        .mockRejectedValueOnce(new Error());

      const body = {
        username: 'testABC123',
        password: 'valiD123',
      };

      const response = await request(app).post('/login').send(body);

      expect(response.statusCode).toStrictEqual(500);
      expect(response.body.message).toStrictEqual('Internal Server Error');
    });

    it('should return 200 on authentication success', async () => {
      const body = {
        username: 'testABC123',
        password: 'testBCA321',
      };

      const response = await request(app).post('/login').send(body);

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body.message).toStrictEqual('Login success');
      expect(response.body).toHaveProperty('token');
    });
  });
});
