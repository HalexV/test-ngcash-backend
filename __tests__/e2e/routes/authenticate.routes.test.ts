/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/client';
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
  });
});
