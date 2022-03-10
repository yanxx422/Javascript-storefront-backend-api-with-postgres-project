import Client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM products`;
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (err) {
      throw new Error(`Could not get products. Error :${err}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const conn = await Client.connect();
      const sql = `SELECT * FROM products WHERE id = ($1)`;
      const result = await conn.query(sql, [id]);
      conn.release();
      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find product ${id}. Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const conn = await Client.connect();
      let sql;
      if (p.id === undefined) {
        sql = `INSERT INTO products(name,price,category) VALUES('${p.name}','${p.price}','${p.category}') RETURNING *`;
      } else {
        sql = `INSERT INTO products(id,name,price,category) VALUES(${p.id},'${p.name}','${p.price}','${p.category}') RETURNING *`;
      }

      const result = await conn.query(sql);
      const product = result.rows[0];
      conn.release();
      return product;
    } catch (err) {
      throw new Error(`Could not add new product${p.name}. Error: ${err}`);
    }
  }
  async delete(id: number): Promise<Product> {
    try {
      const connection = await Client.connect();
      const sql = 'DELETE FROM products WHERE "id"=$1 RETURNING *';
      const result = await connection.query(sql, [id]);
      const firstProduct = result.rows[0];
      connection.release();
      return firstProduct;
    } catch (err) {
      throw new Error(`Cannot Delete Product with id: (${id}) ${err}`);
    }
  }
}
