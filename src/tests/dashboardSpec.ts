import { OrderProductStore } from '../models/orders_products';

import { ProductStore } from '../models/products';
import { OrderStore } from '../models/orders';
import { UserStore } from '../models/users';
import { DashboardQueries } from '../services/dashboard';

const orderProductStore = new OrderProductStore();
const productStore = new ProductStore();
const orderStore = new OrderStore();
const userStore = new UserStore();
const dashboardStore = new DashboardQueries();

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
describe('Dashboard Services', () => {
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
  afterAll(async () => {
    await orderProductStore.delete(OrderProductOne.id);
    await orderProductStore.delete(OrderProductTwo.id);
    await orderProductStore.delete(OrderProductThree.id);
    await orderProductStore.delete(OrderProductFour.id);
    await orderProductStore.delete(OrderProductFive.id);
    await orderProductStore.delete(OrderProductSix.id);
    await orderProductStore.delete(OrderProductSeven.id);

    await orderStore.delete(OrderOne.id.toString());
    await orderStore.delete(OrderTwo.id.toString());
    await orderStore.delete(OrderThree.id.toString());
    await orderStore.delete(OrderFour.id.toString());

    await productStore.delete(ProductOne.id);
    await productStore.delete(ProductTwo.id);
    await productStore.delete(ProductThree.id);
    await productStore.delete(ProductFour.id);
    await productStore.delete(ProductFive.id);
    await productStore.delete(ProductSix.id);

    await userStore.delete(UserOne.id);
    await userStore.delete(UserTwo.id);
  });

  it('should have a fiveMostPopular method', () => {
    expect(dashboardStore.fiveMostPopular).toBeDefined();
  });

  it('should have a productsByCategory method', () => {
    expect(dashboardStore.productsByCategory).toBeDefined();
  });
  it('should have a currentOrdersByUser method', () => {
    expect(dashboardStore.currentOrdersByUser).toBeDefined();
  });
  it('should have a currentOrdersByUser method', () => {
    expect(dashboardStore.currentOrdersByUser).toBeDefined();
  });
  it('should have a completedOrdersByUser method', () => {
    expect(dashboardStore.completedOrdersByUser).toBeDefined();
  });

  it('fiveMostPopular method should return five most popular products', async () => {
    const result = await dashboardStore.fiveMostPopular();
    expect(result).toEqual([
      Object({ name: 'Atomic Habits', id: 3, total_quantity: '25' }),
      Object({ name: 'Lenovo IdeaPad 3', id: 1, total_quantity: '23' }),
      Object({ name: 'Apple AirPods Pro', id: 4, total_quantity: '15' }),
      Object({ name: 'Precious Cat Litter', id: 5, total_quantity: '12' }),
      Object({ name: 'Never Simple: A Memoir', id: 2, total_quantity: '6' })
    ]);
  });

  it('currentOrdersByUser method should return current order with user id', async () => {
    const result = await dashboardStore.currentOrdersByUser(UserOne.id);
    expect(result).toEqual([Object({ id: 3, status: 'active', user_id: '1' })]);
  });
  it('completedOrdersByUser method should return complete order with user id', async () => {
    const result = await dashboardStore.completedOrdersByUser(UserTwo.id);
    expect(result).toEqual([
      Object({ id: 2, status: 'complete', user_id: '2' }),
      Object({ id: 4, status: 'complete', user_id: '2' })
    ]);
  });
  it('productsByCategory method should return products with given category', async () => {
    const result = await dashboardStore.productsByCategory('Electronics');
    expect(result).toEqual([
      Object({
        id: 1,
        name: 'Lenovo IdeaPad 3',
        price: '169.99',
        category: 'Electronics'
      }),
      Object({
        id: 4,
        name: 'Apple AirPods Pro',
        price: '189.99',
        category: 'Electronics'
      })
    ]);
  });
});
