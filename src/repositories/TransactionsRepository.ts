import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

interface Response {
  transactions: Transaction[];
  balance: Balance;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Response> {
    const transactions = await this.find();
    const balance = {
      income: 0,
      outcome: 0,
      total: 0,
    };

    for (let i = 0; i < transactions.length; i += 1) {
      const transaction = transactions[i];
      balance[transaction.type] += transaction.value;
    }

    balance.total = balance.income - balance.outcome;

    return { transactions, balance };
  }
}

export default TransactionsRepository;
