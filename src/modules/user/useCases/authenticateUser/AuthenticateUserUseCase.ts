import prisma from '../../../../client';
import ValidationError from '../../../../errors/ValidationError';
import IAuthenticateUserDTO from '../../dtos/IAuthenticateUserDTO';
import bcrypt from 'bcrypt';

export default class AuthenticateUserUseCase {
  async execute({ username, password }: IAuthenticateUserDTO): Promise<void> {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    if (user == null)
      throw new ValidationError('Username or password is incorrect');

    const compareResult = await bcrypt.compare(password, user.password);

    if (!compareResult)
      throw new ValidationError('Username or password is incorrect');
  }
}