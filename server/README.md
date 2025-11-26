# Server

## Overview

This package exposes the REST API that powers the social application. It is built with Express, connects to MongoDB via Mongoose, and secures authentication flows with JSON Web Tokens (JWT). Business logic is organised into controllers, services, routes, validations, and middleware under the `src/` directory.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- A MongoDB instance (Atlas cluster or local server)

## Installation

1. `cd server`
2. `npm install`

## Environment Variables

Create a `.env` file in the `server/` directory based on the keys below:

| Variable          | Description                                                                              |
| ----------------- | ---------------------------------------------------------------------------------------- |
| `PORT`            | Port for the HTTP server (defaults to `5000` if omitted).                                |
| `NODE_ENV`        | `development` uses the local connection helper, `production` uses the Atlas helper.      |
| `MONGO_URI_LOCAL` | Connection string for your local MongoDB instance. Required when `NODE_ENV=development`. |
| `MONGO_URI_ATLAS` | MongoDB Atlas connection string. Required when `NODE_ENV=production`.                    |
| `JWT_SECRET`      | Secret used to sign and verify access tokens.                                            |

Only define the variables that match the environment you intend to run.

## Available Scripts

- `npm run dev` – starts the server with Nodemon and sets `NODE_ENV=development` (Windows-friendly script).
- `npm start` – starts the server in production mode (`NODE_ENV=production`).
- `npm test` – placeholder script (currently not implemented).

## Typical Workflow

1. Ensure MongoDB is reachable (local instance or Atlas cluster).
2. Provide the correct environment variables.
3. Run `npm run dev` for local development. The API becomes available at `http://localhost:5000/api` by default.

## Project Structure

```
server/
├─ server.js              # Express bootstrap and middleware registration
├─ src/
│  ├─ config/             # Database connection helpers and environment routing
│  ├─ controllers/        # HTTP controllers for domain resources
│  ├─ middlewares/        # Custom middleware (CORS, logging, auth, etc.)
│  ├─ models/             # Mongoose schemas and models
│  ├─ routes/             # API route definitions mounted under /api
│  └─ validations/        # Joi schemas for request validation
└─ package.json
```

## Logging

Requests are logged via Morgan, and console output is colourised with Chalk to make environment feedback easier to read.

## Further Development

- Add integration tests and wire them to `npm test`.
- Externalise environment-specific configuration (e.g., rate limiting, security headers).
- Consider introducing Docker compose files to spin up the API and MongoDB together.
