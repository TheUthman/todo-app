# TodoFlow Frontend

React + Vite frontend for the TodoFlow task manager. The app talks to the Spring Boot backend through a single API base URL configured with `VITE_API_URL`.

## Requirements

- Node.js 20 or newer
- npm

## Setup

Install dependencies:

```bash
npm install
```

Create a local `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

For the deployed backend, use the Railway service URL without `/api` at the end:

```env
VITE_API_URL=https://todo-flow-server-production.up.railway.app
```

The app automatically appends `/api`, so login requests go to:

```text
{VITE_API_URL}/api/auth/login
```

## Scripts

Start the dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Run linting:

```bash
npm run lint
```

## Deployment

When deploying to Vercel, set this environment variable in the Vercel project settings:

```env
VITE_API_URL=https://todo-flow-server-production.up.railway.app
```

This project includes `vercel.json` to rewrite all routes to `index.html`. That is required for React Router routes such as `/login`, `/register`, and `/dashboard` to work when opened directly or refreshed.

The backend CORS configuration must also allow the deployed Vercel frontend URL.

## API Routes Used

- `POST /api/auth/login`
- `POST /api/auth/register`
- `GET /api/dashboard`
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `GET /api/categories`
- `POST /api/categories`
- `PUT /api/categories/{id}`
- `DELETE /api/categories/{id}`
- `GET /api/users/profile`
- `PUT /api/users/profile`
- `POST /api/users/change-password`
