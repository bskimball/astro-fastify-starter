import { defineMiddleware } from 'astro:middleware'
import {
  sessionCookieName,
  validateSessionToken,
  setSessionTokenCookie,
  deleteSessionTokenCookie,
} from '@/session.ts'

export const onRequest = defineMiddleware(async (context, next) => {
  const token = context.cookies.get(sessionCookieName)?.value ?? null
  if (token == null) {
    context.locals.user = null
    context.locals.session = null
    return next()
  }

  const { session, user } = await validateSessionToken(token)

  if (session !== null) {
    setSessionTokenCookie(context, token, session.expiresAt)
  } else {
    deleteSessionTokenCookie(context)
  }

  context.locals.session = session
  context.locals.user = user

  // possibly move to login page
  if (context.url.pathname.includes('/login')) {
    return context.redirect('/')
  }

  return next()
})
