import { type User, type Session, db, sessionTable, userTable } from '@/schema'
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from '@oslojs/encoding'
import { sha256 } from '@oslojs/crypto/sha2'
import { eq } from 'drizzle-orm'
import type { FastifyContextConfig } from 'fastify'
import type { APIContext, AstroCookieSetOptions } from 'astro'
import type { Context as TRPCContext } from '@/api/context.ts'

export const sessionCookieName = 'session'

export function setSessionTokenCookie(
  context: APIContext | TRPCContext | FastifyContextConfig,
  token: string,
  expiresAt: Date,
): void {
  const cookieOptions: AstroCookieSetOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    expires: expiresAt,
    path: '/',
    maxAge: undefined,
    encode: undefined,
    domain: undefined,
  }

  if ('cookies' in context) {
    context.cookies.set(sessionCookieName, token, cookieOptions)
  } else if ('res' in context) {
    context.res.setCookie(sessionCookieName, token, cookieOptions)
  } else {
    console.error('setSessionTokenCookie: context is not valid')
  }
}

export function deleteSessionTokenCookie(
  context: APIContext | TRPCContext | FastifyContextConfig,
): void {
  const cookieOptions: AstroCookieSetOptions = {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    expires: undefined,
    path: '/',
    maxAge: 0,
    encode: undefined,
    domain: undefined,
  }

  if ('cookies' in context) {
    context.cookies.set(sessionCookieName, '', cookieOptions)
  } else if ('res' in context) {
    context.res.setCookie(sessionCookieName, '', cookieOptions)
  } else {
    console.error('setSessionTokenCookie: context is not valid')
  }
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20)

  crypto.getRandomValues(bytes)

  return encodeBase32LowerCaseNoPadding(bytes)
}

export async function createSession(
  token: string,
  userId: number,
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(
      // 30 days from now
      Date.now() + 1000 * 60 * 60 * 24 * 30,
    ),
  }

  await db.insert(sessionTable).values(session)

  return session
}

export async function validateSessionToken(
  token: string,
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
  const result = await db
    .select({ user: userTable, session: sessionTable })
    .from(sessionTable)
    .innerJoin(userTable, eq(sessionTable.userId, userTable.id))
    .where(eq(sessionTable.id, sessionId))

  if (result.length < 1) {
    return { session: null, user: null }
  }

  const { user, session } = result[0]

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id))
    return { session: null, user: null }
  }

  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    await db
      .update(sessionTable)
      .set({ expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30) })
      .where(eq(sessionTable.id, session.id))
  }

  return { session, user }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId))
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null }
