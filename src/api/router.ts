import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import { observable } from '@trpc/server/observable'
import superjson from 'superjson'

type User = {
  id: string
  name?: string
  bio?: string
}

const users: Record<string, User> = {}

export const t = initTRPC.create({
  transformer: superjson,
})

export const appRouter = t.router({
  getUserById: t.procedure.input(z.string()).query((opts) => {
    return users[opts.input]
  }),
  createUser: t.procedure
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
  randomNumber: t.procedure.subscription(() => {
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
})

export type AppRouter = typeof appRouter
