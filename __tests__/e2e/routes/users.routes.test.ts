/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll, jest } from '@jest/globals';
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

    it('should return 400 when password is less than 8 characters', async () => {
      const body = {
        username: 'valid321ABC',
        password: 'inval1D',
      };

      const response = await request(app).post('/users').send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual(
        'Password must be 8 characters or more and contain a number and an uppercase letter'
      );
    });

    it('should return 400 when password does not contain at least a number', async () => {
      const body = {
        username: 'valid321ABC',
        password: 'invaliDd',
      };

      const response = await request(app).post('/users').send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual(
        'Password must be 8 characters or more and contain a number and an uppercase letter'
      );
    });

    it('should return 400 when password does not contain at least an uppercase letter', async () => {
      const body = {
        username: 'valid321ABC',
        password: 'inval1dd',
      };

      const response = await request(app).post('/users').send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual(
        'Password must be 8 characters or more and contain a number and an uppercase letter'
      );
    });

    it('should return 400 when username already exists', async () => {
      const body = {
        username: 'testABC123',
        password: 'valiDd123',
      };

      const response = await request(app).post('/users').send(body);

      expect(response.statusCode).toStrictEqual(400);
      expect(response.body.message).toStrictEqual('Username already exists');
    });

    it('should return 500 when a not mapped error occurs', async () => {
      jest
        .spyOn(CreateUserUseCase.prototype, 'execute')
        .mockRejectedValueOnce(new Error());

      const body = {
        username: 'testABC123',
        password: 'valiDd123',
      };

      const response = await request(app).post('/users').send(body);

      expect(response.statusCode).toStrictEqual(500);
      expect(response.body.message).toStrictEqual('Internal Server Error');
    });

    it('should return 201 when username is created', async () => {
      const body = {
        username: 'valid',
        password: 'valiDd123',
      };

      const response = await request(app).post('/users').send(body);

      expect(response.statusCode).toStrictEqual(201);
      expect(response.body.message).toStrictEqual('User created');
    });
  });
});
