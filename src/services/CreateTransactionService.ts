import { getRepository, getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';
import Transaction from '../models/Transaction';
import AppError from '../errors/AppError';

interface Request {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

interface Response extends Omit<Transaction, 'category'> {
  category: string;
}

class CreateTransactionService {
  public async execute({
    category: categoryTitle,
    ...data
  }: Request): Promise<Response> {
    const transactionRepository = getCustomRepository(TransactionsRepository);
    const categoryRepository = getRepository(Category);

    if (data.type === 'outcome') {
      const { balance } = await transactionRepository.getBalance();

      if (balance.total < data.value) {
        throw new AppError("Balance no");
      }
    }

    let category = await categoryRepository.findOne({
      where: { title: categoryTitle },
    });

    if (!category) {
      category = categoryRepository.create({ title: categoryTitle });
      category = await categoryRepository.save(category);
    }

    const transaction = transactionRepository.create({
      ...data,
      category_id: category.id,
    });

    const transactionSave = await transactionRepository.save(transaction);

    const { title } = category;

    delete transactionSave.category_id;

    return { ...transactionSave, category: title };
  }
}

export default CreateTransactionService;
