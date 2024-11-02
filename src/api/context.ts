import type { CreateFastifyContextOptions } from '@trpc/server/adapters/fastify'
import cookie from 'cookie'
import type { User, Session } from '@/schema.ts'
import { sessionCookieName, validateSessionToken } from '@/session.ts'

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

  if (cookies[sessionCookieName]) {
    const { user, session } = await validateSessionToken(
      cookies[sessionCookieName],
    )
    result.user = user
    result.session = session
  }

  return result
}

export type Context = Awaited<ReturnType<typeof createContext>>
