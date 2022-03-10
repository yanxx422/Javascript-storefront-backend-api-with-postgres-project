import supertest from 'supertest';
import app from '../../src/server';
import Client from '../../src/database';

import { ProductOne } from './mocked_data';
import { UserTwo } from './mocked_data';
import { OrderOne } from './mocked_data';
import { ProductStore } from '../models/products';
import { UserStore } from '../models/users';

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
let userToken = '';

describe('Testing Orders Endpoints', () => {
  beforeAll(async () => {
    await userStore.create(UserTwo);

    await productStore.create(ProductOne);
  });

  afterAll(async () => {
    const connection = await Client.connect();
    const sql =
      'DELETE FROM orders;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n';
    await connection.query(sql);
    connection.release();
  });

  it('Check if server runs, should return 200 status', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('Authenticate user and get token', async () => {
    const response = await request
      .post('/users/authenticate')
      .set('Content-type', 'application/json')
      .send({
        firstName: UserTwo.firstName,
        lastName: UserTwo.lastName,
        password: UserTwo.password
      });
    expect(response.status).toBe(200);

    userToken = response.body;
  });
  it('Test Create should return created order', async () => {
    const response = await request
      .post('/orders')
      .set('Authorization', 'Bearer ' + userToken)
      .send(OrderOne);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        id: OrderOne.id,
        status: OrderOne.status,
        user_id: OrderOne.user_id.toString()
      })
    );
  });

  it('Test Index should return array of orders', async () => {
    const response = await request
      .get('/orders')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: OrderOne.id,
        status: OrderOne.status,
        user_id: OrderOne.user_id.toString()
      }
    ]);
  });

  it('Test Show should return an order', async () => {
    const response = await request
      .get('/orders/1')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        id: OrderOne.id,
        status: OrderOne.status,
        user_id: OrderOne.user_id.toString()
      })
    );
  });

  it('Test delete should return deleted order', async () => {
    const response = await request
      .delete('/orders/1')
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        id: OrderOne.id,
        status: OrderOne.status,
        user_id: OrderOne.user_id.toString()
      })
    );
  });
});
