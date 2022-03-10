import supertest from 'supertest';
import app from '../../src/server';
import Client from '../../src/database';

import { ProductStore } from '../models/products';
import { UserStore } from '../models/users';
import { OrderStore } from '../models/orders';

import { OrderThree, UserOne, ProductOne } from './mocked_data';

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();

let userToken = '';

describe('Testing OrderProducts Endpoints', () => {
  beforeAll(async () => {
    await userStore.create(UserOne);
    await productStore.create(ProductOne);
    await orderStore.create(OrderThree);
  });

  afterAll(async () => {
    const connection = await Client.connect();
    const sql =
      'DELETE from orders_products;\nDELETE FROM orders;\n ALTER SEQUENCE orders_id_seq RESTART WITH 1;\n DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n';
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
        firstName: UserOne.firstName,
        lastName: UserOne.lastName,
        password: UserOne.password
      });
    expect(response.status).toBe(200);

    userToken = response.body;
  });
  it('Test Create should return created order product relation', async () => {
    const response = await request
      .post('/orders_products')
      .set('Authorization', 'Bearer ' + userToken)
      .send({
        id: 1,
        quantity: 20,
        product_id: 1,
        order_id: 3
      });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      quantity: 20,
      product_id: '1',
      order_id: '3'
    });
  });

  it('Test Show should return an order product relation', async () => {
    const response = await request
      .get('/orders_products/1')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      quantity: 20,
      product_id: '1',
      order_id: '3'
    });
  });

  it('Test delete should return deleted order', async () => {
    const response = await request
      .delete('/orders_products/1')
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      id: 1,
      quantity: 20,
      product_id: '1',
      order_id: '3'
    });
  });
});
