# Cocos Backend Challenge
by Emilio Arcioni

## Description

This is a NestJS-based application that implements a simplified version of a stock exchange system. The application allows users to:

- Place market and limit orders to buy/sell stocks
- Make cash deposits and withdrawals 
- Validate orders based on available balance and holdings
- Track portfolio positions and transactions
- Retrieve available instruments

The implementation follows the requirements specified in the Cocos Backend Challenge (https://github.com/cocos-capital/cocos-challenge/blob/main/backend-challenge.md).


## Project Setup

1. Clone the repository
2. Install dependencies
    ```bash
    $ npm install
    ```

3. Create a `.env` file in the root directory by copying the `.env.example` file

4. Complete the `.env` file with the correct database credentials

5. Run the database migrations
    ```bash
    $ npm run migration:run
    ```
    In case you need to revert migrations to a previous state, run:
    ```bash
    $ npm run migration:revert
    ```

## Running the Application

```bash
# development mode
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

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

## Development

### Code Style

This project uses ESLint and Prettier for code formatting. Run the following commands to ensure your code meets the style guidelines:

```bash
# lint code
$ npm run lint

# format code
$ npm run format
```

## Resources

- [NestJS Documentation](https://docs.nestjs.com)
