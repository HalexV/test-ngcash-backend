import prisma from '../../../../client';
import ValidationError from '../../../../errors/ValidationError';
import ICreateUserDTO from '../../dtos/ICreateUserDTO';
import bcrypt from 'bcrypt';

async function validate({ username, password }: ICreateUserDTO): Promise<void> {
  const numberRegexValidator = /[0-9]/;
  const uppercaseRegexValidator = /[A-Z]/;

  if (username.length < 3)
    throw new ValidationError('Username must be 3 characters or more');

  if (
    password.length < 8 ||
    !numberRegexValidator.test(password) ||
    !uppercaseRegexValidator.test(password)
  )
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
export default class CreateUserUseCase {
  async execute({ username, password }: ICreateUserDTO): Promise<void> {
    await validate({ username, password });

    const hashedPassword = await bcrypt.hash(password, 8);

    await prisma.account.create({
      data: {
        user: {
          create: {
            username,
            password: hashedPassword,
          },
        },
      },
    });
  }
}
