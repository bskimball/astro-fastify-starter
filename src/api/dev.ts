import { createServer } from './server.ts'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'node:url'

const fastify = await createServer()

await fastify.register(fastifyStatic, {
  root: fileURLToPath(new URL('../../dist/client', import.meta.url)),
})

fastify.listen({ port: 8080 })
