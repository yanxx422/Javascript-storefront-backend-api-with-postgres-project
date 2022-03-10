import express, { Request, Response } from 'express';
import { DashboardQueries } from '../services/dashboard';
import verifyAuthToken from '../middlewares/verification';

const dashboard = new DashboardQueries();

const fiveMostPopular = async (req: Request, res: Response) => {
  const products = await dashboard.fiveMostPopular();
  res.json(products);
};

const productsByCategory = async (req: Request, res: Response) => {
  const categeory: string = (req.params.category as string) || '';
  const products = await dashboard.productsByCategory(categeory);
  res.json(products);
};

const currentOrdersByUser = async (req: Request, res: Response) => {
  const orders = await dashboard.currentOrdersByUser(req.params.id);
  res.json(orders);
};

const completedOrdersByUser = async (req: Request, res: Response) => {
  const orders = await dashboard.completedOrdersByUser(req.params.id);
  res.json(orders);
};
const dashboard_routes = (app: express.Application) => {
  app.get('/five-most-popular', fiveMostPopular);
  app.get('/products/category/:category', productsByCategory);
  app.get('/user/:id/orders', verifyAuthToken, currentOrdersByUser);
  app.get('/user/:id/orders/completed', verifyAuthToken, completedOrdersByUser);
};

export default dashboard_routes;
