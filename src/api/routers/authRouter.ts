import { router, publicProcedure } from '../trpc.ts'
import { z } from 'zod'
import { generateIdFromEntropySize } from 'lucia'
import { hash } from '@node-rs/argon2'
import { db } from '../../db.ts'
import { lucia } from '../../auth.ts'
import { eq } from 'drizzle-orm'
import { verify } from '@node-rs/argon2'
import { userTable } from '../../schema.ts'

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

      const userId = generateIdFromEntropySize(10)
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

      await db.insert(userTable).values({
        username: input.username,
        id: userId,
        password_hash: passwordHash,
      })

      const session = await lucia.createSession(userId, {})
      const sessionCookie = lucia.createSessionCookie(session.id)

      opts.ctx.res.setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )

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

      const session = await lucia.createSession(existingUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)

      opts.ctx.res.setCookie(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes,
      )

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

    await lucia.invalidateSession(opts.ctx.session.id)

    const sessionCookie = lucia.createBlankSessionCookie()

    opts.ctx.res.setCookie(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    )

    result.redirect = '/login'
    result.ok = true
    return result
  }),
})
