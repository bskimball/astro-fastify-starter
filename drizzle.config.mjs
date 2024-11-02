import { defineConfig } from 'drizzle-kit'

/** @type { import("drizzle-kit").Config } */
export default defineConfig({
  schema: './src/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data.db',
  },
  out: './drizzle',
})
