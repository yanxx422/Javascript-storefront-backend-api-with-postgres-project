import supertest from 'supertest';
import app from '../../src/server';

import {
  ProductOne,
  ProductTwo,
  ProductThree,
  ProductFour,
  ProductFive,
  ProductSix
} from './mocked_data';
import { UserOne, UserTwo } from './mocked_data';
import { OrderOne, OrderTwo, OrderThree, OrderFour } from './mocked_data';
import {
  OrderProductOne,
  OrderProductTwo,
  OrderProductThree,
  OrderProductFour,
  OrderProductFive,
  OrderProductSix,
  OrderProductSeven
} from './mocked_data';

import { ProductStore } from '../models/products';
import { UserStore } from '../models/users';
import { OrderStore } from '../models/orders';
import { OrderProductStore } from '../models/orders_products';
const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
const orderProductStore = new OrderProductStore();
let userToken = '';

describe('Testing Dashboard Endpoints', () => {
  beforeAll(async () => {
    await userStore.create(UserOne);
    await userStore.create(UserTwo);

    await productStore.create(ProductOne);
    await productStore.create(ProductTwo);
    await productStore.create(ProductThree);
    await productStore.create(ProductFour);
    await productStore.create(ProductFive);
    await productStore.create(ProductSix);

    await orderStore.create(OrderOne);
    await orderStore.create(OrderTwo);
    await orderStore.create(OrderThree);
    await orderStore.create(OrderFour);

    await orderProductStore.create(OrderProductOne);
    await orderProductStore.create(OrderProductTwo);
    await orderProductStore.create(OrderProductThree);
    await orderProductStore.create(OrderProductFour);
    await orderProductStore.create(OrderProductFive);
    await orderProductStore.create(OrderProductSix);
    await orderProductStore.create(OrderProductSeven);
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

  it('Test five-most-popular should return five most popular products', async () => {
    const response = await request.get('/five-most-popular');

    expect(response.status).toBe(200);
  });

  it('Test five-productsByCategory-popular should return all the products for that category', async () => {
    const response = await request.get('/products/category/Books');

    expect(response.status).toBe(200);
  });

  it('Test currentOrdersByUser should return active orders by a user,token required', async () => {
    const response = await request
      .get('/user/2/orders')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
  });
  it('Test completedOrdersByUser should return completed orders by a user,token required', async () => {
    const response = await request
      .get('/user/1/orders/completed')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
  });
});
