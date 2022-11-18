import prisma from '../../../../client';
import ValidationError from '../../../../errors/ValidationError';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';

export default class CreateUserUseCase {
  async execute({ username, password }: ICreateUserDTO): Promise<void> {
    if (username.length < 3)
      throw new ValidationError('Username must be 3 characters or more');

    if (password.length < 8)
      throw new ValidationError(
        'Password must be 8 characters or more and contain a number and an uppercase letter'
      );

    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user != null) throw new ValidationError('Username already exists');
  }
}
