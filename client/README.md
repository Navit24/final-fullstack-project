# Client

## Overview

This package contains the React front-end for the social application. It is powered by Vite, written in TypeScript, and styled primarily with Material UI (MUI). Application state is managed through Redux Toolkit slices stored under `src/store/`.

## Prerequisites

- Node.js 18 or newer
- npm 9 or newer

## Installation

1. `cd client`
2. `npm install`

## Available Scripts

- `npm run dev` – starts the Vite development server with hot module reloading.
- `npm run build` – type-checks the project and creates a production-ready bundle in `dist/`.
- `npm run preview` – serves the built bundle locally for smoke-testing.
- `npm run lint` – runs ESLint against the project sources.

## API Configuration

The app expects the back-end API to be reachable at `http://localhost:5000/api`. To point the client at another environment, update `API_BASE_URL` inside `src/config/api.ts`. For production builds you can automate this step by loading the value from an environment-aware configuration layer (e.g., using `import.meta.env` and Vite's `VITE_*` variables).

## Project Structure

```
client/
├─ src/
│  ├─ components/    # Shared UI components (forms, navigation, post cards, etc.)
│  ├─ config/        # API base URL and endpoint declarations
│  ├─ pages/         # Route-level pages (feed, profile, auth, etc.)
│  ├─ services/      # Axios API clients and domain-specific services
│  ├─ store/         # Redux Toolkit slices and store configuration
│  ├─ theme/         # Material UI theme configuration
│  └─ types/         # Shared TypeScript definitions
├─ public/           # Static assets served by Vite
└─ package.json
```

## Development Workflow

1. Ensure the server is running locally (or update `API_BASE_URL` to a remote instance).
2. Run `npm run dev` to start the Vite dev server.
3. Access the app at the URL reported by Vite (default `http://localhost:5173`).

## Building for Production

- `npm run build` generates an optimised bundle in `dist/`.
- Serve the `dist/` directory with any static file server (e.g., `npm install -g serve && serve dist`).
- Remember to point `API_BASE_URL` to the production API before deploying.

## Recommendations

- Add automated tests (unit/integration) to improve confidence in UI regressions.
- Integrate environment-specific configuration (e.g., `.env.development`) for the API base URL.
- Consider enabling code-splitting per route to keep bundle sizes small as the app grows.
