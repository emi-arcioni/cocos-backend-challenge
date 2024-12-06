# Cocos Backend Challenge
by Emilio Arcioni

## Description

This is a NestJS-based application that implements a simplified version of a stock exchange system. The application allows users to:

- Place market and limit orders to buy/sell stocks
- Make cash deposits and withdrawals 
- Cancel orders
- Validate orders based on available balance and holdings
- Track portfolio positions and transactions
- Retrieve available instruments

The implementation follows the requirements specified in the Cocos Backend Challenge (https://github.com/cocos-capital/cocos-challenge/blob/main/backend-challenge.md).

## Requirements

- Node.js v20.18.0
- Postgres >= v16.1
- Docker (optional)

## Project Setup

1. Clone the repository

1. Create a `.env` file in the root directory by copying the `.env.example` file, and complete the `.env` file with the correct database credentials

1. (Optional) Run the docker compose file to start the Postgres database
    ```bash
    $ docker compose up -d
    ```

1. Install dependencies
    ```bash
    $ npm install
    ```

### Migrations
Although there is a post-install script that runs the database migrations and syncs the portfolios, it's recommended to run the migrations manually to ensure everything is set up correctly.
1. Run the database migrations
    ```bash
    $ npm run migration:run
    ```
    In case you need to revert migrations to a previous state, run:
    ```bash
    $ npm run migration:revert
    ```
1. Sync the portfolios
    ```bash
    $ npm run sync-portfolios
    ```

## Running the Application

```bash
$ npm run start
```

There are other scripts to run the application in watch mode and production mode, but the recommended way to run the application is using the `start` script.

## Testing

The project includes both unit tests and end-to-end tests:

```bash
# unit and end-to-end tests
$ npm run test

# test coverage
$ npm run test:cov
```

## API Documentation

### Available Endpoints

#### Health Check
- `GET /` 
  - Check if API is working

#### Orders
- `POST /orders` 
  - Place a new order
  - Accepts market and limit orders
  - Returns different status codes based on order status:
    - 201: New order created
    - 202: Order filled
    - 400: Order rejected
    - 200: Other statuses
- `DELETE /orders/:id`
  - Cancel an order by ID
  - Returns different status codes based on results: 
    - 200: Order successfully cancelled
    - 404: Order not found

#### Portfolios
- `GET /portfolios/:accountNumber` 
  - Get portfolio for a specific account
  - Returns portfolio positions and details

#### Instruments
- `GET /instruments`
 - Retrieve available instruments
  - Optional query parameters:
    - `ticker`: Filter by instrument ticker
    - `name`: Filter by instrument name
    - `page`: Pagination
    - `limit`: Pagination

### Request Examples

```bash
# Get all instruments
curl http://localhost:3000/instruments

# Get instruments filtered by ticker
curl http://localhost:3000/instruments?ticker=PAMP

# Place an order
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "accountNumber": 10001,
    "type": "MARKET",
    "side": "BUY",
    "size": 100,
    "ticker": "HAVA"
  }'

# Get portfolio
curl http://localhost:3000/portfolios/10001
```

### Postman Collection

You can import the `Cocos_Backend_Challenge.postman_collection.json` file to Postman to test the API endpoints.

## Development

### Code Style

This project uses ESLint and Prettier for code formatting. Run the following commands to ensure your code meets the style guidelines:

```bash
# lint code
$ npm run lint

# format code
$ npm run format
```

## Design decisions

- **Portfolios**: I've decided to use a consolidated portfolio object to track positions and balances, as it simplifies the retrieval of portfolio information and reduces the number of database queries.

  Each time a new order is created, the portfolio for that user is re-calculated to reflect the updated positions and balance. This synchronization ensures that the portfolio always represents the current state after every transaction.

- **Database**: I've noticed a lack of indexes definitions for different tables, so I added some of them, specially in the `orders` table where I created a indexes on the `instrumentId` and `userId` columns to improve the performance of the queries.

- **Folder structure / Modules**: I've created a separate module for each main entity of the system (Instruments, Market Data, Orders, Portfolios, Users), as it makes the code easier to understand and maintain, and it's based on NestJS best practices as well.

- **Locking mechanism**: I've added a pesimistic locking strategy to prevent race conditions when creating the orders and updating the portfolio. I've used TypeORM query runner transactions since it's a simple and effective way to handle the locking mechanism.

## Business assumptions

- **Balance calculations** In orders.service.ts, `create()` method, you will find comments explaining the assumptions made for the balance calculations.