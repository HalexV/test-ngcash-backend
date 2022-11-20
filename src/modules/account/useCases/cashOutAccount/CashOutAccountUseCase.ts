import prisma from '../../../../client';
import NotFoundError from '../../../../errors/NotFoundError';
import ValidationError from '../../../../errors/ValidationError';
import ICashOutAccountDTO from '../../dtos/ICashOutAccountDTO';

async function validate({
  cashInUsername,
  cashOutUser,
  value,
}: ICashOutAccountDTO): Promise<any> {
  if (cashInUsername === cashOutUser.username)
    throw new ValidationError('Cash out to yourself invalid');

  const cashOutAccount = await prisma.account.findUnique({
    where: {
      id: cashOutUser.accountId,
    },
  });

  if (cashOutAccount == null)
    throw new NotFoundError('Cash out account not found');

  if (value > cashOutAccount.balance)
    throw new ValidationError('Balance insufficient');

  const cashInAccountId = await prisma.user.findUnique({
    where: {
      username: cashInUsername,
    },
    select: {
      accountId: true,
    },
  });

  if (cashInAccountId == null)
    throw new NotFoundError('Cash in username does not exist');

  const cashInAccount = await prisma.account.findUnique({
    where: {
      id: cashInAccountId.accountId,
    },
  });

  if (cashInAccount == null)
    throw new NotFoundError('Cash in account not found');

  return {
    cashInAccount,
    cashOutAccount,
  };
}

export default class CashOutAccountUseCase {
  async execute({
    cashInUsername,
    cashOutUser,
    value,
  }: ICashOutAccountDTO): Promise<void> {
    await validate({ cashInUsername, cashOutUser, value });
  }
}