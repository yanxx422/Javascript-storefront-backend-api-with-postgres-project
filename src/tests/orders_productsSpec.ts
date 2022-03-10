import { OrderProductStore } from '../models/orders_products';

import { ProductStore } from '../models/products';
import { OrderStore } from '../models/orders';
import { UserStore } from '../models/users';
const orderProductStore = new OrderProductStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
const userStore = new UserStore();

import { OrderThree, UserOne, ProductOne } from './mocked_data';

describe('OrderProducts Models', () => {
  beforeAll(async () => {
    await userStore.create(UserOne);
    await productStore.create(ProductOne);
    await orderStore.create(OrderThree);
  });
  afterAll(async () => {
    await productStore.delete(ProductOne.id);
    await orderStore.delete(OrderThree.id.toString());
    await userStore.delete(UserOne.id);
  });

  it('should have a show method', () => {
    expect(orderProductStore.show).toBeDefined();
  });

  it('should have a create method', () => {
    expect(orderProductStore.create).toBeDefined();
  });
  it('should have a delete method', () => {
    expect(orderProductStore.delete).toBeDefined();
  });

  it('Create method should return an OrderProduct', async () => {
    const result = await orderProductStore.create({
      id: 1,
      quantity: 20,
      product_id: 1,
      order_id: 3
    });
    expect(result).toEqual(
      jasmine.objectContaining({
        id: 1,
        quantity: 20,
        product_id: '1',
        order_id: '3'
      })
    );
  });

  it('show method should return the correct order product relation', async () => {
    const result = await orderProductStore.show(1);
    expect(result).toEqual(
      jasmine.objectContaining({
        id: 1
      })
    );
  });

  it('delete method should delete', async () => {
    const result = await orderProductStore.delete(1);
    expect(result).toEqual(
      jasmine.objectContaining({
        id: 1
      })
    );
  });
});
