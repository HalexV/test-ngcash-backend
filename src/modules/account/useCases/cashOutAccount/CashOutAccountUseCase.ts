import ValidationError from '../../../../errors/ValidationError';
import ICashOutAccountDTO from '../../dtos/ICashOutAccountDTO';

export default class CashOutAccountUseCase {
  async execute({
    cashInUsername,
    cashOutUsername,
    value,
  }: ICashOutAccountDTO): Promise<void> {
    if (cashInUsername === cashOutUsername)
      throw new ValidationError('Cash out to yourself invalid');
  }
}
