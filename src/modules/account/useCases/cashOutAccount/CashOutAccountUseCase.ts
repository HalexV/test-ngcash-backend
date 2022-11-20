import ValidationError from '../../../../errors/ValidationError';
import ICashOutAccountDTO from '../../dtos/ICashOutAccountDTO';

export default class CashOutAccountUseCase {
  async execute({
    cashInUsername,
    cashOutUser,
    value,
  }: ICashOutAccountDTO): Promise<void> {
    if (cashInUsername === cashOutUser.username)
      throw new ValidationError('Cash out to yourself invalid');
  }
}
