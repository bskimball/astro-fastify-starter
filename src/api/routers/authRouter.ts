import { router, publicProcedure } from '@/api/trpc.ts'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { userTable, db } from '@/schema.ts'
import {
  createSession,
  generateSessionToken,
  setSessionTokenCookie,
  invalidateSession,
  deleteSessionTokenCookie,
} from '@/session.ts'
import { hash, verify } from '@node-rs/argon2'

type Result = {
  error: null | string
  ok: boolean
  redirect: string
}

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3)
          .max(31)
          .regex(/^[a-z0-9_-]+$/),
        password: z.string().min(6).max(255),
      }),
    )
    .mutation(async (opts) => {
      const { input } = opts
      const result: Result = {
        error: null,
        ok: false,
        redirect: '',
      }

      const passwordHash = await hash(input.password, {
        memoryCost: 19456,
        timeCost: 2,
        outputLen: 32,
        parallelism: 1,
      })

      const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, input.username))

      if (users.length > 0) {
        result.error = 'Username is not unique'
        return result
      }

      const insertUser = await db
        .insert(userTable)
        .values({
          username: input.username,
          password_hash: passwordHash,
        })
        .returning({ id: userTable.id })

      const token = generateSessionToken()
      const session = await createSession(token, insertUser[0].id)

      setSessionTokenCookie(opts.ctx, token, session.expiresAt)

      result.ok = true
      result.redirect = '/login'
      return result
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(3)
          .max(31)
          .regex(/^[a-z0-9_-]+$/),
        password: z.string().min(6).max(255),
      }),
    )
    .mutation(async (opts) => {
      const result: Result = {
        error: null,
        ok: false,
        redirect: '',
      }

      const users = await db
        .select()
        .from(userTable)
        .where(eq(userTable.username, opts.input.username))

      if (users.length < 1) {
        result.error = 'The user does not exist.'
        result.redirect = '/'
        return result
      }

      const existingUser = users[0]

      const validPassword = await verify(
        existingUser.password_hash,
        opts.input.password,
        {
          memoryCost: 19456,
          timeCost: 2,
          outputLen: 32,
          parallelism: 1,
        },
      )
      if (!validPassword) {
        result.error = 'Invalid password'
        return result
      }

      if (opts.ctx.session) {
        await invalidateSession(opts.ctx.session.id)
        deleteSessionTokenCookie(opts.ctx)
      }

      const token = generateSessionToken()
      const session = await createSession(token, existingUser.id)
      setSessionTokenCookie(opts.ctx, token, session.expiresAt)

      result.ok = true
      result.redirect = '/'
      return result
    }),
  logout: publicProcedure.input(z.undefined()).mutation(async (opts) => {
    const result: Result = {
      error: null,
      ok: false,
      redirect: '',
    }

    if (!opts.ctx.session) {
      result.error = 'No session'
      return result
    }

    await invalidateSession(opts.ctx.session.id)
    deleteSessionTokenCookie(opts.ctx)

    result.redirect = '/login'
    result.ok = true
    return result
  }),
})
