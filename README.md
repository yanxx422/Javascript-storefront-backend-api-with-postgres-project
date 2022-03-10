# Storefront Backend Project


## Introduction

This is a project that builds a JavaScript API for an online store based on a requirements given by the stakeholders. Tasks include architect the database, tables, and columns to fulfill the requirements. A RESTful API is created to be accessible to the frontend developer. There are also tests, secured user information with encryption, and provide tokens for integration into the frontend. The detailed requirment are in  `REQUIREMENTS.md` file.
## Technologies used
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Environment Set-up
Default port is 5432 as specified in `docker-composed.yml`file.

There should be an `.env` file at the root folder. As an example,
```
POSTGRES_HOST=localhost  
POSTGRES_DB=shopping_db  
POSTGRES_DB_TEST=shopping_db_test  
POSTGRES_USER=<username> 
POSTGRES_PASSWORD=<password> 
ENV=dev  
BCRYPT_PASSWORD=speak-friend-and-enter  
SALT_ROUNDS=10  
WEB_TOKEN=abcd1234
```
To create a database `shopping_db`, open Postgres terminal,
Run `CREATE USER <username> WITH PASSWORD <password>;`
Run `CREATE DATABASE shopping_db;`
Run `GRANT ALL PRIVILEGES ON DATABASE shopping_dbTO <username>;`

The test scripts will automatically create `shopping_db_test` database upon running and delete it when finished, so there is no need to create a test database.

After creating the database the `.env` file, go back to terminal,
Run ` db-migrate up`  to create the database schema (don't forget to run `db-migrate down` delete the tables in the end).

Run `npm install` to install all dependencies.
Run `npm run lint` to use eslint and prettier.
Run `npm run lint -- --fix` to fix lint and prettier errors.
Run `npm run test` to run jasmine tests.

## Start in development mode

Run `npm run watch` and check `http://localhost:3000/`.

## Start in regular mode

Run `npm run build` and `npm run start`and check `http://localhost:3000/`.



# API Endpoints
## User
The  format is :
- id
- firstName
- lastName
- password

#### Create a user: `POST http://localhost:3000/users`
#### Display all users: `GET http://localhost:3000/users` , token required
#### Display a specified user given its id: `GET http://localhost:3000/users/:id` , token required
#### Authenticate users: `POST http://localhost:3000/users/authenticate` , token required
#### Delete a specified user `DELETE http://localhost:3000/users/:id` , token required


## Product
The format is :
-  id
- name
- price
- category
#### Create a product: `POST http://localhost:3000/products`
#### Display all products: `GET http://localhost:3000/products`
#### Display a specified product given its id: `GET http://localhost:3000/products/:id` , token required
#### Delete a specified product`DELETE http://localhost:3000/products/:id` , token required

## Order
The format is :
-  id
- status
- user_id

#### Create an order (the referenced user must already exist) : `POST http://localhost:3000/orders'`
#### Display all orders: `GET http://localhost:3000/orders'`
#### Display a specified order given its id: `GET http://localhost:3000/orders/:id'` , token required
#### Delete a specified order`DELETE http://localhost:3000/orders/:id'` , token required

## OrderProduct
The format is :
-  id
- quantity
- product_id
- order_id

#### Create an order product relationship (the referenced order and product must already exist) : `POST http://localhost:3000/orders_products`
#### Display a specified order product relationship given its id: `GET http://localhost:3000/orders_products/:id'`
#### Delete a specified order product relationship `DELETE http://localhost:3000/orders_products/:id` , token required

## Dashboard
#### Display the five most popular products: `GET http://localhost:3000/five-most-popular` , the list is ordered by product's sold quantity

#### Display all the products for a specified category : `GET http://localhost:3000/products/category/:category`
#### Display all the active orders for a given user id: `GET http://localhost:3000/user/:id/orders`, token required
#### Display all the complete orders for a given user id: `GET http://localhost:3000/user/:id/orders/completed`, token required

# Further information

This is the second project of Udacity's  full-stack Javascript nanodegree program.
The instructions can be seen here:
https://github.com/udacity/nd0067-c2-creating-an-api-with-postgresql-and-express-project-starter

