import supertest from 'supertest';
import app from '../../src/server';
import Client from '../../src/database';

import { UserOne, UserTwo } from './mocked_data';

const request = supertest(app);

let userToken = '';

describe('Testing Users Endpoints..', () => {
  beforeAll(async () => {
    await request.post('/users').send(UserOne);
  });

  afterAll(async () => {
    const connection = await Client.connect();
    const sql =
      'DELETE FROM users; \nALTER SEQUENCE users_id_seq RESTART WITH 1;\n';
    await connection.query(sql);
    connection.release();
  });

  it('Check if server runs, should return 200 status', async () => {
    const response = await request.get('/');
    expect(response.status).toBe(200);
  });

  it('Authenticate user and get token', async () => {
    const response = await request
      .post('/users/authenticate/')
      .set('Content-type', 'application/json')
      .send({
        firstName: UserOne.firstName,
        lastName: UserOne.lastName,
        password: UserOne.password
      });
    expect(response.status).toBe(200);
    userToken = response.body;
  });
  it('Test Index should return array of users', async () => {
    const response = await request
      .get('/users')
      .set('Authorization', 'Bearer ' + userToken);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([
      jasmine.objectContaining({
        firstname: UserOne.firstName,
        lastname: UserOne.lastName
      })
    ]);
  });

  it('Test Show should return a User', async () => {
    const response = await request
      .get('/users/1')
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        firstname: UserOne.firstName,
        lastname: UserOne.lastName
      })
    );
  });

  it('Test Create should return created User', async () => {
    const response = await request
      .post('/users')
      .set('Authorization', 'Bearer ' + userToken)
      .send(UserTwo);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        firstName: UserTwo.firstName,
        lastName: UserTwo.lastName
      })
    );
  });

  it('Test Show should return a deleted User', async () => {
    const response = await request
      .delete('/users/1')
      .set('Authorization', 'Bearer ' + userToken);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      jasmine.objectContaining({
        firstname: UserOne.firstName,
        lastname: UserOne.lastName
      })
    );
  });
});
