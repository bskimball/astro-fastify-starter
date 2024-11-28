import { handler as ssrHandler } from './dist/server/entry.mjs'
import { createServer } from './dist/server/api.mjs'
import fastifyStatic from '@fastify/static'
import { fileURLToPath } from 'node:url'
import cors from '@fastify/cors'

const isProduction = process.env.NODE_ENV === 'production'
const origin = process.env.ORIGIN
  ? process.env.ORIGIN
  : isProduction
    ? ['http://localhost:8080', 'http://127.0.0.1:8080']
    : [
        'http://localhost:4321',
        'http://localhost:8080',
        'http://127.0.0.1:4321',
        'http://127.0.0.1:8080',
      ]

async function start() {
  const fastify = await createServer()

  await fastify.register(cors, {
    origin,
    credentials: true,
  })

  await fastify.register(fastifyStatic, {
    root: fileURLToPath(new URL('./dist/client', import.meta.url)),
  })

  if (isProduction) {
    fastify.use((req, res, next) => {
      ssrHandler(req, res, next)
    })
  }

  try {
    await fastify.listen({ port: 8080, host: '0.0.0.0' })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start().then(() => {
  console.log('Server started')
})
