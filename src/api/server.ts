import Fastify from 'fastify'
import fastifyMiddie from '@fastify/middie'
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from '@trpc/server/adapters/fastify'
import { createContext } from './context.ts'
import { type AppRouter, appRouter } from './router.ts'
import ws from '@fastify/websocket'

export async function createServer() {
  const fastify = Fastify({ logger: true, maxParamLength: 5000 })

  await fastify.register(fastifyMiddie)

  await fastify.register(ws)

  await fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    useWSS: true,
    trpcOptions: {
      router: appRouter,
      createContext,
      onError({ path, error }) {
        // report to error monitoring
        console.error(`Error in tRPC handler on path '${path}':`, error)
      },
    } satisfies FastifyTRPCPluginOptions<AppRouter>['trpcOptions'],
  })

  fastify.get('/hello', function (_request, reply) {
    reply.send('Hello world!')
  })

  return fastify
}
