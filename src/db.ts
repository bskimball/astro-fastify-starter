import sqlite from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { migrate } from 'drizzle-orm/better-sqlite3/migrator'

const sqliteDB = sqlite('data.db')
export const db = drizzle(sqliteDB)

// migrate(db, { migrationsFolder: './drizzle' })
// sqliteDB.close()
