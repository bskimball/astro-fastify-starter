import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import cookie from 'cookie'
import { lucia } from '../auth.ts'
import { type User } from './router'
import { type Session } from 'lucia'

type Result = {
  req: CreateFastifyContextOptions['req']
  res: CreateFastifyContextOptions['res']
  user: null | User
  session: null | Session
}

export async function createContext({ req, res }: CreateFastifyContextOptions) {
  const cookies = cookie.parse(req.headers?.cookie || '')

  const result: Result = {
    req,
    res,
    user: null,
    session: null,
  }

  if (cookies[lucia.sessionCookieName]) {
    const { user, session } = await lucia.validateSession(
      cookies[lucia.sessionCookieName],
    )
    result.user = user
    result.session = session
  }

  return result
}

export type Context = Awaited<ReturnType<typeof createContext>>
