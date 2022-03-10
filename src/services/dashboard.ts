import Client from '../database';
import { Product } from '../models/products';
import { Order } from '../models/orders';

export class DashboardQueries {
  async fiveMostPopular(): Promise<{ name: string; quantity: number }[]> {
    try {
      const conn = await Client.connect();
      const sql =
        'SELECT products.name,products.id, SUM(orders_products.quantity) total_quantity FROM products INNER JOIN orders_products ON products.id = orders_products.product_id GROUP BY products.name, products.id ORDER BY total_quantity DESC LIMIT 5';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to get products by quantity: ${err}`);
    }
  }

  async productsByCategory(category: string): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM products WHERE category='${category}'`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to fetch products`);
    }
  }

  async currentOrdersByUser(user_id: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE status ='active' AND user_id = '${user_id}'`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to fetch active orders`);
    }
  }

  async completedOrdersByUser(user_id: string): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE status ='complete' AND user_id = '${user_id}'`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`unable to fetch completed orders`);
    }
  }
}
