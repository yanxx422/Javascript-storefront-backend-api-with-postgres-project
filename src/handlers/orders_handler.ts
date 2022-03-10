import express, { Request, Response } from 'express';
import { Order, OrderStore } from '../models/orders';
import verifyAuthToken from '../middlewares/verification';

const store = new OrderStore();

const index = async (req: Request, res: Response) => {
  const orders = await store.index();
  res.json(orders);
};

const show = async (req: Request, res: Response) => {
  const order = await store.show(req.params.id);
  res.json(order);
};

const create = async (req: Request, res: Response) => {
  try {
    const newOrder: Order = {
      id: req.body.id,
      status: req.body.status,
      user_id: parseInt(req.body.user_id)
    };
    const result = await store.create(newOrder);
    res.json(result);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const destroy = async (req: Request, res: Response) => {
  try {
    const order = await store.delete(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const orders_routes = (app: express.Application) => {
  app.get('/orders', index);
  app.get('/orders/:id', show);
  app.post('/orders', create);
  app.delete('/orders/:id', verifyAuthToken, destroy);
};

export default orders_routes;
