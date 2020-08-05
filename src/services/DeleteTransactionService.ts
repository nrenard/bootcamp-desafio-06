import { getCustomRepository } from 'typeorm';

import TransactionsRepository from '../repositories/TransactionsRepository';
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionRepository = getCustomRepository(TransactionsRepository);

    const transaction = await transactionRepository.findOne({ where: { id } });

    if (transaction) {
      await transactionRepository.delete(id);
    } else {
      throw new AppError("Transaction does not exists!", 404);
    }
  }
}

export default DeleteTransactionService;
