import { createServer } from './server.ts'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'node:url'
import cors from '@fastify/cors'

const fastify = await createServer()

await fastify.register(cors, {
  origin: [
    'http://localhost:4321',
    'http://localhost:8080',
    'http://127.0.0.1:4321',
    'http://127.0.0.1:8080',
  ],
})

await fastify.register(fastifyStatic, {
  root: fileURLToPath(new URL('../../dist/client', import.meta.url)),
})

fastify.listen({ port: 8080 })
