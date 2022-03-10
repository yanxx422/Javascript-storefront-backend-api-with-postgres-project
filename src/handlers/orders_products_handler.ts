import express, { Request, Response } from 'express';
import { OrderProduct, OrderProductStore } from '../models/orders_products';

import verifyAuthToken from '../middlewares/verification';

const store = new OrderProductStore();

const show = async (_req: Request, res: Response) => {
  const order_product = await store.show(parseInt(_req.params.id));
  res.json(order_product);
};

const create = async (req: Request, res: Response) => {
  const orderProduct: OrderProduct = {
    id: req.body.id,
    quantity: req.body.quantity,
    product_id: req.body.product_id,
    order_id: req.body.order_id
  };
  try {
    const newOrderProduct = await store.create(orderProduct);
    res.json(newOrderProduct);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const destroy = async (req: Request, res: Response) => {
  const order_product = await store.delete(req.params.id as unknown as number);
  res.json(order_product);
};

const orders_products_routes = (app: express.Application) => {
  app.get('/orders_products/:id', show);
  app.post('/orders_products', create);
  app.delete('/orders_products/:id', verifyAuthToken, destroy);
};

export default orders_products_routes;
