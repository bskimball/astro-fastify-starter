import { initTRPC } from '@trpc/server'
import type { Context } from './context.ts'
import superjson from 'superjson'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
})

export const router = t.router
export const publicProcedure = t.procedure
