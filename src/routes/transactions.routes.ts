import { Router } from 'express';
import { getCustomRepository } from 'typeorm';
import multer from 'multer';

import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import uploadConfig from '../config/upload';

const upload = multer(uploadConfig);

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const data = await transactionsRepository.getBalance();

  return response.json(data);
});

transactionsRouter.post('/', async (request, response) => {
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute(request.body);

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute(request.params.id);

  return response.status(204).json();
});

transactionsRouter.post('/import', upload.single('file'), async (request, response) => {
  const { file } = request;
  const pathFile = `${uploadConfig.directory}/${file.filename}`;

  const importTransactionsService = new ImportTransactionsService();

  const transactions = await importTransactionsService.execute(pathFile);
  return response.json(transactions);
});

export default transactionsRouter;
