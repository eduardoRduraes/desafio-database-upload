import { Router } from 'express';
import { getCustomRepository } from 'typeorm';

import multer from 'multer';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';

import UploadConfig from '../config/UploadConfig';

const transactionsRouter = Router();

const upload = multer(UploadConfig);

transactionsRouter.get('/', async (request, response) => {
  const transactionsRepository = getCustomRepository(TransactionsRepository);
  const transactions = await transactionsRepository.find();
  const balance = await transactionsRepository.getBalance();
  return response.json({ transactions, balance });
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body;

  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });

  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params;

  const deleteTransactionService = new DeleteTransactionService();

  await deleteTransactionService.execute({ id });

  return response.json({ delete: 'ok' });
});

// transactionsRouter.post(
// '/import',
//   upload.single('file'),
//   async (request, response) => {
//     const importTransaction = new ImportTransactionsService();
//     const transaction = await importTransaction.execute(request.file.path);
//     const createTransaction = new CreateTransactionService();
//     for (const transaction of transactions) {
//       await createTransaction.execute({
//         title: transaction.title,
//         type: transaction.type,
//         value: transaction.value,
//         category: transaction.category,
//       });
//     }
//     return response.json(transaction);
//   },
// );

export default transactionsRouter;
