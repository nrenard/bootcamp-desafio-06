import csvParser from 'csv-parse';
import fs from 'fs';

import CreateTransactionService from './CreateTransactionService';

interface TransactionRequest {
  title: string;
  type: 'income' | 'outcome';
  value: number;
  category: string;
}

class ImportTransactionsService {
  async execute(filePath: string): Promise<TransactionRequest[]> {
    const csvReadStream = fs.createReadStream(filePath);

    const transactions: TransactionRequest[] = [];

    const createTransactionService = new CreateTransactionService();

    const parser = csvParser({ from_line: 2 });

    const parseCSV = csvReadStream.pipe(parser);

    parseCSV.on('data', async (line) => {
      const [title, type, value, category] = line;

      transactions.push({
        title: title.trim(),
        type: type.trim(),
        value: Number(value.trim()),
        category: category.trim()
      });
    });

    await new Promise((resolve) => {
      parseCSV.on('end', async () => {
        for(let i = 0; i < transactions.length; i += 1) {
          await createTransactionService.execute(transactions[i]);
        }

        return resolve(transactions);
      });
    });

    return transactions;
  }
}

export default ImportTransactionsService;
