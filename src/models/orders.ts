import Client from '../database';

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};

export class OrderStore {
  async index(): Promise<Order[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get orders. Error :${err}`);
    }
  }

  async show(id: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM orders WHERE id = ($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order ${id}. Error: ${err}`);
    }
  }
  async delete(id: string): Promise<Order> {
    try {
      const conn = await Client.connect();
      const result = await conn.query(
        'DELETE FROM orders WHERE "id"=$1 RETURNING *',
        [id]
      );
      return result.rows[0];
    } catch (err) {
      throw new Error(`Cannot delete order with id: (${id}) ${err}`);
    }
  }
  async create(o: Order): Promise<Order> {
    try {
      const conn = await Client.connect();
      let sql;
      if (o.id === undefined) {
        sql = `INSERT INTO orders (status,user_id) VALUES('${o.status}',${o.user_id}) RETURNING *`;
      } else {
        sql = `INSERT INTO orders (id,status,user_id) VALUES('${o.id}','${o.status}',${o.user_id}) RETURNING *`;
      }

      const result = await conn.query(sql);

      const order = result.rows[0];
      conn.release();
      return order;
    } catch (err) {
      throw new Error(`Could not add new order${o.id}. Error: ${err}`);
    }
  }
}
