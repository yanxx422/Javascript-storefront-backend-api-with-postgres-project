import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';

import orders_routes from './handlers/orders_handler';
import products_routes from './handlers/products_handler';
import users_routes from './handlers/users_handler';
import orders_products_routes from './handlers/orders_products_handler';
import dashboard_routes from './handlers/dashboard_handler';

const app: express.Application = express();
const address = '3000';

app.use(bodyParser.json());

app.get('/', function (req: Request, res: Response) {
  res.send('Welcome to the shopping center management app!');
});

orders_routes(app);
products_routes(app);
users_routes(app);
orders_products_routes(app);
dashboard_routes(app);

app.listen(3000, function () {
  console.log(`starting app on: ${address}`);
});

export default app;
