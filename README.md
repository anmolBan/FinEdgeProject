# FinEdge API

FinEdge is a simple personal finance REST API built with Node.js, Express, and MongoDB. It manages **users**, **transactions** (income/expense), and **budgets**, and demonstrates async programming, middleware, validation, caching, and testing.

---

## Features

- **User management**
  - User registration and sign-in with hashed passwords (bcrypt)
  - JWT-based authentication
- **Transactions**
  - Create, read, update, delete income/expense records
  - Per-user scoping (each user sees only their own data)
  - Summary endpoint for income/expense/net
  - In-memory cache (with TTL) for summary results
- **Budgets**
  - CRUD for monthly budgets with savings targets
  - Per-user scoping
- **Middleware & infrastructure**
  - Global error handler with structured JSON responses
  - Request logging middleware
  - Validation via Zod schemas
  - Rate limiting for all requests
  - CORS enabled
  - Health-check endpoint
- **Testing**
  - Jest unit tests for services, controllers, models, middleware, and error handling

---

## Tech Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT for authentication
- Zod for validation
- Jest for testing

Key files:

- App entry: [src/app.js](src/app.js)
- DB connection: [src/db/mongo.js](src/db/mongo.js)
- Models: [src/models/userModel.js](src/models/userModel.js), [src/models/transactionModel.js](src/models/transactionModel.js), [src/models/budgetModel.js](src/models/budgetModel.js)
- Controllers: [src/controllers/userController.js](src/controllers/userController.js), [src/controllers/transactionController.js](src/controllers/transactionController.js), [src/controllers/budgetController.js](src/controllers/budgetController.js)
- Services: [src/services/userServices.js](src/services/userServices.js), [src/services/transactionServices.js](src/services/transactionServices.js), [src/services/budgetServices.js](src/services/budgetServices.js)
- Routes: [src/routes/userRoutes.js](src/routes/userRoutes.js), [src/routes/transactionRoutes.js](src/routes/transactionRoutes.js), [src/routes/budgetRoutes.js](src/routes/budgetRoutes.js)
- Middleware: [src/middleware/auth.js](src/middleware/auth.js), [src/middleware/validator.js](src/middleware/validator.js), [src/middleware/errorHandler.js](src/middleware/errorHandler.js), [src/middleware/logger.js](src/middleware/logger.js)
- Utilities: [src/utils/cache.js](src/utils/cache.js)

---

## Getting Started

### Prerequisites

- Node.js (LTS)
- MongoDB running locally or in the cloud

### Installation

```bash
npm install
```

### Environment variables

Create a `.env` file **in the project root**:

```env
PORT=3000
MONGO_URI="mongodb://127.0.0.1:27017/FinEdgeDB"
JWT_SECRET="your-strong-secret"
```

### Run the development server

```bash
npm run dev
```

The API will be available at `http://localhost:3000`.

Health check:

- `GET /health` → `{ "status": "ok" }`

---

## Authentication

- Users register and sign in under `/users` routes.
- Sign-in returns a JWT token.
- All **transaction** and **budget** routes are protected and require:

  - Header: `Authorization: Bearer <token>`

The `auth` middleware ([src/middleware/auth.js](src/middleware/auth.js)) verifies the token and populates `req.user.id`.

---

## API Overview

### Users

Base path: `/users`

| Method | Route           | Description              |
|--------|-----------------|--------------------------|
| POST   | `/create`       | Register new user        |
| POST   | `/signinUser`   | Sign in, returns JWT     |

Example registration body:

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

Example sign-in body:

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

### Transactions

Base path: `/transactions` (all routes require `Authorization: Bearer <token>`)

| Method | Route                 | Description                      |
|--------|-----------------------|----------------------------------|
| POST   | `/`                   | Add income/expense               |
| GET    | `/`                   | Fetch all transactions (per user)|
| GET    | `/:id`                | View single transaction          |
| PATCH  | `/:id`                | Update transaction               |
| DELETE | `/:id`                | Delete transaction               |
| GET    | `/summary/all`        | Income–expense summary (per user)|

Example create transaction body:

```json
{
  "type": "income",
  "category": "salary",
  "amount": 5000,
  "date": "2026-02-06T00:00:00.000Z",
  "note": "February salary"
}
```

The controller automatically associates the transaction with the authenticated user (`req.user.id`).

The summary endpoint uses an in-memory cache ([src/utils/cache.js](src/utils/cache.js)) with a TTL to avoid recomputing results too often. The cache is cleared whenever a transaction is created, updated, or deleted.

### Budgets

Base path: `/budgets` (all routes require `Authorization: Bearer <token>`)

| Method | Route    | Description                     |
|--------|----------|---------------------------------|
| POST   | `/`      | Create a new budget             |
| GET    | `/`      | Fetch all budgets (per user)    |
| GET    | `/:id`   | View a specific budget          |
| PATCH  | `/:id`   | Update a budget                 |
| DELETE | `/:id`   | Remove a budget                 |

Example create budget body:

```json
{
  "month": 2,
  "year": 2026,
  "monthlyGoal": 2000,
  "savingsTarget": 500
}
```

The controller sets the `user` field to the authenticated user.

---

## Middleware

- **auth** ([src/middleware/auth.js](src/middleware/auth.js))
  - Reads `Authorization: Bearer <token>` header
  - Verifies JWT and sets `req.user = { id: <userId> }`

- **validator** ([src/middleware/validator.js](src/middleware/validator.js))
  - Wraps Zod schemas for body/params/query
  - On success, replaces `req.body`, `req.params`, `req.query` with parsed data
  - On failure, forwards the `ZodError` to the global error handler

- **errorHandler** ([src/middleware/errorHandler.js](src/middleware/errorHandler.js))
  - Centralizes error responses
  - Returns structured JSON with fields like `statusCode`, `message`, `errorType`, `fieldErrors`, `path`, `method`, `timestamp`
  - Handles:
    - Custom errors with `err.statusCode`
    - Zod validation errors
    - Mongoose validation errors
    - Mongo duplicate key errors (e.g., duplicate email)
    - JWT/auth errors
    - Fallback 500 for unexpected errors

- **logger** ([src/middleware/logger.js](src/middleware/logger.js))
  - Logs method, URL, status code, and response time for each request

- **CORS**
  - Enabled globally in [src/app.js](src/app.js) using the `cors` package
  
- **Rate limiting**
  - Configured in [src/app.js](src/app.js) using `express-rate-limit` (100 requests / 15 minutes per IP)


---

## Validation

Zod schemas enforce input shapes for users, transactions, and budgets:

- Users: [src/validation/userValidation.js](src/validation/userValidation.js)
- Transactions: [src/validation/transactionValidation.js](src/validation/transactionValidation.js)
- Budgets: [src/validation/budgetValidation.js](src/validation/budgetValidation.js)

These are used via the `validator` middleware or directly in controllers.

---

## Testing

Jest is used for unit testing.

Run all tests:

```bash
npm test
```

Test coverage includes:

- User services: [tests/userServices.test.js](tests/userServices.test.js)
- Transaction services: [tests/transactionServices.test.js](tests/transactionServices.test.js)
- Budget services: [tests/budgetServices.test.js](tests/budgetServices.test.js)
- Budget model validation: [tests/budgetModel.test.js](tests/budgetModel.test.js)
- Controllers:
  - Users: [tests/userController.test.js](tests/userController.test.js)
  - Transactions: [tests/transactionController.test.js](tests/transactionController.test.js)
  - Budgets: [tests/budgetController.test.js](tests/budgetController.test.js)
- Middleware:
  - Validator: [tests/validator.test.js](tests/validator.test.js)
  - Error handler: [tests/errorHandler.test.js](tests/errorHandler.test.js)
- A small root test in [test.js](test.js) to keep Jest happy

---

## Project Structure

```text
src/
  app.js
  db/
    mongo.js
  models/
    userModel.js
    transactionModel.js
    budgetModel.js
  controllers/
    userController.js
    transactionController.js
    budgetController.js
  services/
    userServices.js
    transactionServices.js
    budgetServices.js
  routes/
    userRoutes.js
    transactionRoutes.js
    budgetRoutes.js
  middleware/
    auth.js
    validator.js
    errorHandler.js
    logger.js
  validation/
    userValidation.js
    transactionValidation.js
    budgetValidation.js
  utils/
    cache.js

tests/
  userServices.test.js
  transactionServices.test.js
  budgetServices.test.js
  budgetModel.test.js
  userController.test.js
  transactionController.test.js
  budgetController.test.js
  validator.test.js
  errorHandler.test.js
```

---

## Notes

- This project is designed as a learning/assessment backend for REST API development, async programming, middleware, and testing.
- For production use, you should:
  - Use a strong, secret `JWT_SECRET` and never commit it
  - Configure proper logging and monitoring
  - Consider moving to a persistent cache (Redis) instead of in-memory for horizontal scaling.
