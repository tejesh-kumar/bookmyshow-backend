import express from 'express';
import { port } from './server-config';
import routes from './routes';
import globalErrorHandler from './utils/errors/globalErrorHandler';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use(globalErrorHandler);

app.listen(port, () => {
  console.log(`Connected to server on port ${port}`);
});
