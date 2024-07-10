import { handler as ssrHandler } from './dist/server/entry.mjs'
import { createServer } from './dist/server/api.mjs'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'node:url'

const fastify = await createServer()

await fastify.register(fastifyStatic, {
  root: fileURLToPath(new URL('./dist/client', import.meta.url)),
})

fastify.use(ssrHandler)

fastify.listen({ port: 8080 })
