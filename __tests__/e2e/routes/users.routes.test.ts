/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/client';
import CreateUserUseCase from '../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Routes - Users', () => {
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

  describe('POST /users', () => {
    it('should return 400 when username is less than 3 characters', async () => {
      const body = {
        username: 'ab',
        password: 'valid123ABC',
      };

      const response = await request(app).post('/users').send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual(
        'Username must be 3 characters or more'
      );
    });
  });
});
