// import AppError from '../errors/AppError';

import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';
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
    const categoriesRepository = getRepository(Category);

    if (type !== 'income' && type !== 'outcome')
      throw new AppError('You can create only income or outcome types.');

    const balance = await transactionsRepository.getBalance();
    const { total } = balance;

    if (type === 'outcome' && value > total)
      throw new AppError(
        'You cant create an outcome transaction which leaves you negatives.',
      );

    const checkCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (checkCategory) {
      throw new AppError('Category is exists.');
    }
    const newCategory = categoriesRepository.create({ title: category });

    await categoriesRepository.save(newCategory);

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: newCategory.id,
    });

    await transactionsRepository.save(transaction);
    return transaction;
  }
}

export default CreateTransactionService;
