import Client from '../database';

export type OrderProduct = {
  id?: number;
  quantity: number;
  product_id: number;
  order_id: number;
};

export class OrderProductStore {
  async show(order_id: number): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders_products WHERE id =${order_id}`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not show orders. Error: ${err}`);
    }
  }

  async create(op: OrderProduct): Promise<OrderProduct> {
    try {
      const conn = await Client.connect();
      let sql;
      if (op.id === undefined) {
        sql = `INSERT INTO orders_products (quantity,order_id,product_id) VALUES(${op.quantity},${op.order_id},${op.product_id}) RETURNING *`;
      } else {
        sql = `INSERT INTO orders_products (id,quantity,order_id,product_id) VALUES(${op.id},${op.quantity},${op.order_id},${op.product_id}) RETURNING *`;
      }

      const result = await conn.query(sql);
      conn.release();
      const order_product = result.rows[0];
      return order_product;
    } catch (err) {
      throw new Error(
        `Could not add new order_product association with order_id =  ${op.order_id} and product_id = ${op.product_id}. Error: ${err}`
      );
    }
  }

  async delete(id: number): Promise<OrderProduct> {
    try {
      const connection = await Client.connect();
      const sql = 'DELETE FROM orders_products WHERE "id"=$1 RETURNING *';

      const result = await connection.query(sql, [id]);

      const user = result.rows[0];

      connection.release();

      return user;
    } catch (err) {
      throw new Error(`Unable to delete orders_products (${id}): ${err}`);
    }
  }
}
