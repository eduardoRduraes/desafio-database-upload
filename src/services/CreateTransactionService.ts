import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
// import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    const { total } = await transactionsRepository.getBalance();
    let findCategory = await categoryRepository.findOne({
      where: { title: category },
    });

    if (type === 'outcome' && total < value)
      throw new AppError('You do not have enough balance');

    if (!findCategory) {
      findCategory = categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(findCategory);
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: findCategory,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
