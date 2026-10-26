# Cartellow frontend

The React and Vite frontend currently contains a responsive UI foundation for:

- Email-based sign-in
- The store overview dashboard
- Catalog settings

The sign-in flow and catalog settings are frontend prototypes. They are not yet
connected to the Laravel API, so signing in opens the dashboard locally and
catalog edits are not persisted.

## Development

From this directory, install dependencies and start the Vite development server:

```bash
npm install
npm run dev
```

Run `npm run build` to type-check and create a production build, or `npm run lint`
to run ESLint.
