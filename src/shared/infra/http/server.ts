import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import {
  initializeTransactionalContext,
  patchTypeORMRepositoryWithBaseRepository,
} from 'typeorm-transactional-cls-hooked';

import cors from 'cors';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

initializeTransactionalContext(); // Initialize cls-hooked
patchTypeORMRepositoryWithBaseRepository(); // patch Repository with BaseRepository.

const app = express();

app.use(cors());
app.use(express.json());
app.use('/files', express.static(uploadConfig.uploadsFolder));
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response
      .status(err.statusCode)
      .json({ status: 'error', message: err.message });
  }

  console.error(err);

  return response
    .status(500)
    .json({ status: 'error', message: 'Internal server error' });
});

let port: number;
if (process.env.PORT) {
  port = parseInt(process.env.PORT, 10);
} else {
  port = 3333;
}

app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Server started on port ${port}`);
});
