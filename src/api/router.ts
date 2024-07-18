import { z } from 'zod'
import { observable } from '@trpc/server/observable'
import { authRouter } from './routers/authRouter.ts'
import { router, publicProcedure } from './trpc.ts'

export type User = {
  id: string
  name?: string
  bio?: string
}

const users: Record<string, User> = {}

export const appRouter = router({
  getUserById: publicProcedure.input(z.string()).query((opts) => {
    return users[opts.input]
  }),
  createUser: publicProcedure
    .input(
      z.object({
        name: z.string().min(3),
        bio: z.string().max(142).optional(),
      }),
    )
    .mutation((opts) => {
      const id = Date.now().toString()

      const user: User = { id, ...opts.input }
      users[user.id] = user
      return user
    }),
  randomNumber: publicProcedure.subscription(() => {
    return observable<{ randomNumber: number }>((emit) => {
      const timer = setInterval(() => {
        let randomNumber = Math.random()
        emit.next({ randomNumber })
      }, 1000)
      return () => {
        clearInterval(timer)
      }
    })
  }),
  auth: authRouter,
})

export type AppRouter = typeof appRouter
