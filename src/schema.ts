import { drizzle } from 'drizzle-orm/better-sqlite3'
import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core'
import type { InferSelectModel } from 'drizzle-orm'

export const db = drizzle('data.db')

export const userTable = sqliteTable('user', {
  id: integer('id').primaryKey(),
  username: text('username').notNull().unique(),
  password_hash: text('password_hash').notNull(),
})

export const sessionTable = sqliteTable('session', {
  id: text('id').notNull().primaryKey(),
  userId: integer('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})

export type User = InferSelectModel<typeof userTable>
export type Session = InferSelectModel<typeof sessionTable>
