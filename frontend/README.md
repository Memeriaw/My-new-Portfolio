# Memeriaw Adugnaw — Portfolio Frontend

React + Vite frontend for the public portfolio.

## Run locally

1. Install Node.js LTS.
2. From this directory, run `npm install`.
3. Copy `.env.example` to `.env` and set `VITE_API_URL` to the backend API base URL.
4. Run `npm run dev` and open the local URL shown by Vite.

The contact form submits `POST /contact` to `VITE_API_URL` (for example,
`http://localhost:5000/api/contact`). For a deployed site, set `VITE_API_URL`
to the publicly reachable backend API URL before building and deploying the
frontend. Do not use `localhost` for a public site: on a visitor's phone,
`localhost` points to that phone, not your backend. The backend must also have
the Gmail notification settings configured in its own environment to deliver
messages to your Gmail inbox on any device.

If the backend cannot be reached, the form reports an error instead of claiming
that a message was saved locally. If the backend accepts a message but email
delivery fails, the form displays a warning; the message remains in the
backend's admin inbox.

## Available scripts

- `npm run dev` — start the development server
- `npm run build` — create the production build in `dist/`
- `npm run preview` — preview the production build locally
