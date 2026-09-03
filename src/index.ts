import express from 'express';
import { port } from './server-config';
import routes from './routes';
import { connectRedis } from './config/redis.js';
import globalErrorHandler from './utils/errors/globalErrorHandler';

const startServer = async () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(routes);

  app.use(globalErrorHandler);

  await connectRedis();

  app.listen(port, () => {
    console.log(`Connected to server on port ${port}`);
  });
};

startServer();
