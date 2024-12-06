# *** Latest ***
I have updated to Astro v5 and React 19. Since the Astro/react integration has not yet updated their deps your NPM install will need to include the --peer-legacy-deps flag. I have removed Next ui and react-hook-form and it is using react action api for forms. 

# Astro Fastify Starter

This is an example repo of having astro and fastify in the same app.
This example is based on the fastify example in the
[node adapter](https://docs.astro.build/en/guides/integrations-guide/node/#middleware) section.
The main difference is this uses typescript. It also has an example of using the
[trpc fastify adapter](https://trpc.io/docs/server/adapters/fastify), so you have end-to-end type safety.

[Blog Post](https://brian-kimball.com/blog/fastify-astro-starter)

## Auth

Auth was set up for [Lucia](https://lucia-auth.com/)
but has been changed to the guide at [Lucia-next](https://lucia-next.pages.dev/).
It's currently using username/password auth and storing to a session.
That information is available to astro as well as fastify and trpc.

## ORM

Data access is done using [Drizzle](https://orm.drizzle.team/), and the example is set up for an SQLite database.

## 🚀 Project Structure

Inside your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/
│   │   └── server.ts
│   │   └── dev.ts
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   |── pages/
│   |   └── index.astro
|   |-- middleware.ts
|   |-- schema.ts
|   |-- session.ts
└── run-server.mjs
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
|:--------------------------|:-------------------------------------------------|
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run start`           | Start your production build                      |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run generate`        | Generate schema                                  |
| `npm run migrate`         | Run migrations                                   |
| `npm run studio`          | Run Drizzle-kit Studio                           |
