import { Lucia } from 'lucia'
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle'
import { db } from './db.ts'
import { userTable, sessionTable } from './schema.ts'

const adapter = new DrizzleSQLiteAdapter(db, sessionTable, userTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV !== 'development',
      // domain:
      //   process.env.NODE_ENV === 'development'
      //     ? 'http://localhost:4321'
      //     : 'http://localhost:8080',
    },
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
    }
  },
})

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  username: string
}
