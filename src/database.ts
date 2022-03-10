import dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB_TEST,
  ENV
} = process.env;

const connect = {
  host: POSTGRES_HOST,
  database: ENV !== 'test' ? POSTGRES_DB : POSTGRES_DB_TEST,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD
};

const pool = new Pool(connect);

pool.on('connect', () => {
  //console.log(`${process.env.ENV} environment config loaded, db connection established`);
});

export default pool;
