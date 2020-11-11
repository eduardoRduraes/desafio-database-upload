import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface CategoryDTO {
  id: string;
  title: string;
}

interface CreateTransaction {
  id: string;
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: CategoryDTO;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await this.find();

    const { income, outcome } = transactions.reduce(
      (acc, tran) => {
        switch (tran.type) {
          case 'income':
            acc.income += Number(tran.value);
            break;
          case 'outcome':
            acc.outcome += Number(tran.value);
            break;
          default:
            break;
        }
        return acc;
      },
      {
        income: 0,
        outcome: 0,
        total: 0,
      },
    );
    const total = income - outcome;
    return { income, outcome, total };
  }
}

export default TransactionsRepository;
