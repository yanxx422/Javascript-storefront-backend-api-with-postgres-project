import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/users';

import jwt from 'jsonwebtoken';
import verifyAuthToken from '../middlewares/verification';

const store = new UserStore();

const index = async (_req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (_req: Request, res: Response) => {
  try {
    const user = await store.show(_req.params.id);
    res.json(user);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const create = async (req: Request, res: Response) => {
  const user: User = {
    id: req.body.id,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  };
  try {
    const newUser = await store.create(user);
    const token = jwt.sign(
      { newUser },
      process.env.WEB_TOKEN as unknown as string
    );

    res.json({ ...user, token: token });
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};
const destroy = async (req: Request, res: Response) => {
  const deleted = await store.delete(req.params.id);
  res.json(deleted);
};

const authenticate = async (req: Request, res: Response) => {
  const userObj: User = {
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    password: req.body.password
  };
  try {
    const user = await store.authenticate(
      userObj.firstName,
      userObj.lastName,
      userObj.password
    );
    const token = jwt.sign(
      {
        user
      },
      process.env.WEB_TOKEN as unknown as string
    );
    res.json(token);
  } catch (err) {
    res.status(401);
    res.json(err);
  }
};

const users_routes = (app: express.Application) => {
  app.get('/users', verifyAuthToken, index);
  app.get('/users/:id', verifyAuthToken, show);
  app.post('/users', create);
  app.post('/users/authenticate', authenticate);
  app.delete('/users/:id', verifyAuthToken, destroy);
};

export default users_routes;
