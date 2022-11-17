import { describe, it, expect } from '@jest/globals';
import ValidationError from '../../../../../../src/errors/ValidationError';
import CreateUserUseCase from '../../../../../../src/modules/user/useCases/createUser/CreateUserUseCase';

describe('User - Create User Use Case', () => {
  it('should not create a user when username is less than 3 characters', async () => {
    const sut = new CreateUserUseCase();

    const userDTO = {
      username: '',
      password: 'any',
    };

    try {
      await sut.execute(userDTO);
    } catch (error: any) {
      expect(error).toBeInstanceOf(ValidationError);
      expect(error.message).toStrictEqual(
        'Username must be 3 characters or more'
      );
    }
  });
});
