import { OrderStore } from '../models/orders';
import { UserStore } from '../models/users';

const orderStore = new OrderStore();
const userStore = new UserStore();

import { OrderOne, UserTwo } from './mocked_data';

describe('Orders Models', () => {
  afterAll(async () => {
    await userStore.delete(UserTwo.id);
  });

  it('should have an index method', () => {
    expect(orderStore.index).toBeDefined();
  });

  it('should have a show method', () => {
    expect(orderStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderStore.create).toBeDefined();
  });

  it('Create method should return an Order', async () => {
    await userStore.create(UserTwo);

    const result = await orderStore.create(OrderOne);
    expect(result).toEqual(
      jasmine.objectContaining({
        status: OrderOne.status,
        user_id: OrderOne.user_id.toString()
      })
    );
  });

  it('index method should return a list of orders', async () => {
    const result = await orderStore.index();

    expect(result).toEqual([
      jasmine.objectContaining({
        id: OrderOne.id
      })
    ]);
  });

  it('show method should return the correct order id', async () => {
    const result = await orderStore.show(OrderOne.id.toString());
    expect(result).toEqual(
      jasmine.objectContaining({
        id: OrderOne.id
      })
    );
  });
  it('show method should delete the correct order', async () => {
    const result = await orderStore.delete(OrderOne.id.toString());
    expect(result).toEqual(
      jasmine.objectContaining({
        id: OrderOne.id
      })
    );
  });
});
