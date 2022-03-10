import Client from '../database';

import bcrypt from 'bcrypt';

export type User = {
  id?: string;
  firstName: string;
  lastName: string;
  password: string;
};

export class UserStore {
  async index(): Promise<User[]> {
    try {
      const conn = await Client.connect();
      const sql = 'SELECT * FROM users';

      const result = await conn.query(sql);

      conn.release();

      return result.rows;
    } catch (err) {
      throw new Error(`unable get users: ${err}`);
    }
  }

  async show(id: string): Promise<User> {
    try {
      const sql = `SELECT * FROM users WHERE id=${id}`;

      const conn = await Client.connect();
      const result = await conn.query(sql);
      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`unable show user ${id}: ${err}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      const pepper: string = process.env.BCRYPT_PASSWORD as unknown as string;
      const saltRounds: string = process.env.saltRounds as unknown as string;
      const conn = await Client.connect();
      let sql;
      const hash = bcrypt.hashSync(u.password + pepper, parseInt(saltRounds));
      if (u.id === undefined) {
        sql = `INSERT INTO users (firstName,lastName, password) VALUES('${u.firstName}', '${u.lastName}','${hash}') RETURNING *`;
      } else {
        sql = `INSERT INTO users (id,firstName,lastName, password) VALUES('${u.id}','${u.firstName}', '${u.lastName}','${hash}') RETURNING *`;
      }

      const result = await conn.query(sql);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(
        `unable create user (${u.firstName} ${u.lastName}): ${err}`
      );
    }
  }
  async delete(id: string): Promise<User> {
    try {
      const connection = await Client.connect();
      const sql = 'DELETE FROM users WHERE "id"=$1 RETURNING *';

      const result = await connection.query(sql, [id]);

      const user = result.rows[0];

      connection.release();

      return user;
    } catch (err) {
      throw new Error(`Unable to delete user (${id}): ${err}`);
    }
  }

  async authenticate(
    firstName: string,
    lastName: string,
    password: string
  ): Promise<User | null> {
    try {
      const pepper: string = process.env.BCRYPT_PASSWORD || '';

      const conn = await Client.connect();
      const sql = `SELECT * FROM users where firstName='${firstName}' and lastName ='${lastName}' `;

      const result = await conn.query(sql);
      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password + pepper, user.password)) {
          conn.release();
          return user;
        }
      }
      return null;
    } catch (err) {
      throw new Error(
        `unable to get user: firstName='${firstName}' and lastName ='${lastName}: ${err}`
      );
    }
  }
}
