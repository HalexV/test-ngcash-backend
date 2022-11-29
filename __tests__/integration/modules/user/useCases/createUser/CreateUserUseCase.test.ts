/* eslint-disable @typescript-eslint/no-misused-promises */
import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import prisma from '../../../../../../src/client';
import bcrypt from 'bcrypt';
import CreateUserUseCase from '../../../../../../src/modules/user/useCases/createUser/CreateUserUseCase';
import { Account, User } from '@prisma/client';

describe('Integration - User - Create User Use Case', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    const deleteUsers = prisma.user.deleteMany();
    const deleteAccounts = prisma.account.deleteMany();

    await prisma.$transaction([deleteUsers, deleteAccounts]);

    await prisma.$disconnect();
  });

  it('should create a user and an account with balance equals to 100', async () => {
    const sut = new CreateUserUseCase();

    const createUserDTO = {
      username: 'testABC123',
      password: 'testZXC321',
    };

    await sut.execute(createUserDTO);

    const userCreated = (await prisma.user.findUnique({
      where: {
        username: createUserDTO.username,
      },
    })) as User;

    const accountCreated = (await prisma.account.findUnique({
      where: {
        id: userCreated.accountId,
      },
    })) as Account;

    const bcryptResult = await bcrypt.compare(
      createUserDTO.password,
      userCreated.password
    );

    expect(userCreated.username).toStrictEqual(createUserDTO.username);
    expect(userCreated.password).not.toStrictEqual(createUserDTO.password);
    expect(accountCreated.balance).toBe(100);
    expect(bcryptResult).toBeTruthy();
  });
});
