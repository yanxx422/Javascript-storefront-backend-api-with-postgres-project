import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/products';
import verifyAuthToken from '../middlewares/verification';

const store = new ProductStore();

const index = async (req: Request, res: Response) => {
  const products = await store.index();
  res.json(products);
};

const show = async (req: Request, res: Response) => {
  const product = await store.show(req.params.id);
  res.json(product);
};

const create = async (req: Request, res: Response) => {
  try {
    const newProduct: Product = {
      id: req.body.id,
      name: req.body.name,
      price: req.body.price,
      category: req.body.category
    };
    const result = await store.create(newProduct);
    res.json(result);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const destroy = async (req: Request, res: Response) => {
  const product = await store.delete(req.params.id as unknown as number);
  res.json(product);
};
const products_routes = (app: express.Application) => {
  app.get('/products', index);
  app.get('/products/:id', show);
  app.post('/products', verifyAuthToken, create);
  app.delete('/products/:id', verifyAuthToken, destroy);
};

export default products_routes;
