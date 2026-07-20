# Bloglist — Full Stack Open Part 7

The frontend and backend live in the same project while keeping separate
package files.

## Development

Start the backend from `backend`:

```bash
npm install
npm run dev
```

Start the Vite frontend from `frontend`:

```bash
npm install
npm run dev
```

Vite proxies `/api` requests to `http://localhost:3003`.

## Production build

Build the frontend from `frontend`:

```bash
npm run build
```

The backend serves the generated `frontend/dist` directory and supports
client-side routes with an SPA fallback.

Create `backend/.env` from `.env.example`. Never commit real credentials.
