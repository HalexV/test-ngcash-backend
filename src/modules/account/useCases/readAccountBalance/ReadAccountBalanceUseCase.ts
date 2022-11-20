import prisma from '../../../../client';
import NotFoundError from '../../../../errors/NotFoundError';
import IReadAccountBalanceDTO from '../../dtos/IReadAccountBalanceDTO';

export default class ReadAccountBalanceUseCase {
  async execute({ accountId }: IReadAccountBalanceDTO): Promise<void> {
    const account = await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });

    if (account == null) throw new NotFoundError('Account not found');
  }
}
