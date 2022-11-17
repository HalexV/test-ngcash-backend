import ValidationError from '../../../../errors/ValidationError';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

export default class CreateUserUseCase {
  async execute({ username, password }: ICreateUserDTO): Promise<void> {
    if (username.length < 3)
      throw new ValidationError('Username must be 3 characters or more');
  }
}
