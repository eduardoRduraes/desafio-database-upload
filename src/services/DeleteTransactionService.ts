// import AppError from '../errors/AppError';

import { getCustomRepository } from 'typeorm';
import AppError from '../errors/AppError';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const checksTransaction = transactionsRepository.findOne({ where: { id } });

    if (!checksTransaction) throw new AppError('Transaction is not exists.');

    await transactionsRepository.delete({ id });
  }
}

export default DeleteTransactionService;
