/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, beforeAll, expect, afterAll } from '@jest/globals';
import { User } from '@prisma/client';
import request from 'supertest';
import app from '../../../src/app';
import prisma from '../../../src/client';
import ensureAuthenticated from '../../../src/middlewares/ensureAuthenticated';
import AuthenticateUserUseCase from '../../../src/modules/user/useCases/authenticateUser/AuthenticateUserUseCase';
import CreateUserUseCase from '../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('Middlewares - Ensure Authenticated', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let validToken: string;
  let validToken2: string;
  beforeAll(async () => {
    await prisma.$connect();
    const createUser = new CreateUserUseCase();
    const authenticateUser = new AuthenticateUserUseCase();

    const createUserDTO = {
      username: 'testABC123',
      password: 'testBCA321',
    };

    await createUser.execute(createUserDTO);
    validToken = (await authenticateUser.execute(createUserDTO)).token;

    const createUserDTO2 = {
      username: 'testCBA123',
      password: 'testBCA321',
    };

    await createUser.execute(createUserDTO2);
    validToken2 = (await authenticateUser.execute(createUserDTO2)).token;

    const deleteUser = (await prisma.user.findUnique({
      where: {
        username: createUserDTO2.username,
      },
    })) as User;

    await prisma.user.delete({
      where: {
        id: deleteUser.id,
      },
    });

    await prisma.account.delete({
      where: {
        id: deleteUser.accountId,
      },
    });

    app.get('/test', ensureAuthenticated, function (request, response) {
      return response.status(200).json({
        result: 'ok',
      });
    });
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteAccounts = prisma.account.deleteMany();

    await prisma.$transaction([deleteUsers, deleteAccounts]);

    await prisma.$disconnect();
  });

  it('should return 401 when token is missing', async () => {
    const response = await request(app).get('/test');

    expect(response.statusCode).toStrictEqual(401);
    expect(response.body.message).toStrictEqual('Token is missing');
  });

  it('should return 401 when token is invalid', async () => {
    const response = await request(app)
      .get('/test')
      .set(
        'authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
      );

    expect(response.statusCode).toStrictEqual(401);
    expect(response.body.message).toStrictEqual('Invalid token');
  });

  it('should return 401 when user does not exist', async () => {
    const response = await request(app)
      .get('/test')
      .set('authorization', `Bearer ${validToken2}`);

    expect(response.statusCode).toStrictEqual(401);
    expect(response.body.message).toStrictEqual('User does not exist');
  });
});
