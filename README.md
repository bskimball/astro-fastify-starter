# Astro Fastify Starter

This is an example repo of having astro and fastify in the same app.
It's based off the fastify example in the 
[node adapter](https://docs.astro.build/en/guides/integrations-guide/node/#middleware) section.
The main difference is this uses typescript. It also has an example of using the 
[trpc fastify adapter,](https://trpc.io/docs/server/adapters/fastify) so you have end to end type safety. 

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

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
│   └── pages/
│       └── index.astro
└── run-server.mjs
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

