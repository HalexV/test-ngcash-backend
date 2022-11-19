import prisma from '../../../../client';
import ValidationError from '../../../../errors/ValidationError';
import IAuthenticateUserDTO from '../../dtos/IAuthenticateUserDTO';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const jwtSecret = process.env.JWT_SECRET ?? '12kflnfoi34493j0jkdsmalsaejp';

interface Token {
  token: string;
}

async function validate({
  username,
  password,
}: IAuthenticateUserDTO): Promise<any> {
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

  return {
    user,
  };
}
export default class AuthenticateUserUseCase {
  async execute({ username, password }: IAuthenticateUserDTO): Promise<Token> {
    const { user } = await validate({ username, password });

    const token = await jwt.sign(
      {
        id: user.username,
      },
      jwtSecret,
      {
        expiresIn: '1d',
      }
    );

    return {
      token,
    };
  }
}
