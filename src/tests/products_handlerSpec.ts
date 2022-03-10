import supertest from 'supertest';
import app from '../../src/server';
import Client from '../../src/database';

import { ProductOne, ProductTwo } from './mocked_data';
import { UserOne } from './mocked_data';
import { ProductStore } from '../models/products';
import { UserStore } from '../models/users';

const request = supertest(app);
const userStore = new UserStore();
const productStore = new ProductStore();
let userToken = '';

describe('Testing Products Endpoints', () => {
  beforeAll(async () => {
    await userStore.create(UserOne);

    await productStore.create(ProductOne);
  });

  afterAll(async () => {
    const connection = await Client.connect();
    const sql =
      'DELETE FROM users;\n ALTER SEQUENCE users_id_seq RESTART WITH 1;\nDELETE FROM products;\n ALTER SEQUENCE products_id_seq RESTART WITH 1;\n';
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

  it('Test Index should return array of products', async () => {
    const response = await request
      .get('/products')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      {
        id: ProductOne.id,
        name: ProductOne.name,
        price: ProductOne.price.toString(),
        category: ProductOne.category
      }
    ]);
  });

  it('Test Show should return product', async () => {
    const response = await request
      .get('/products/1')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        name: ProductOne.name
      })
    );
  });

  it('Test Create should return created Product', async () => {
    const response = await request
      .post('/products')
      .set('Authorization', 'Bearer ' + userToken)
      .send(ProductTwo);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        name: ProductTwo.name,
        price: ProductTwo.price.toString(),
        category: ProductTwo.category
      })
    );
  });

  it('Test delete should return deleted Product', async () => {
    const response = await request
      .delete('/products/2')
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        name: ProductTwo.name,
        price: ProductTwo.price.toString(),
        category: ProductTwo.category
      })
    );
  });
});
