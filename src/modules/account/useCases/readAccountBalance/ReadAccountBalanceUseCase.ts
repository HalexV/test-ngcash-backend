import prisma from '../../../../client';
import IReadAccountBalanceDTO from '../../dtos/IReadAccountBalanceDTO';

export default class ReadAccountBalanceUseCase {
  async execute({ accountId }: IReadAccountBalanceDTO): Promise<void> {
    await prisma.account.findUnique({
      where: {
        id: accountId,
      },
    });
  }
}
