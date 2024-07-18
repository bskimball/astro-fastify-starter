import type { AppRouter } from './router.ts'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import {
  createTRPCClient,
  httpBatchLink,
  createWSClient,
  wsLink,
  splitLink,
} from '@trpc/client'
import superjson from 'superjson'

export type RouterInput = inferRouterInputs<AppRouter>
export type RouterOutput = inferRouterOutputs<AppRouter>

function getLinks() {
  if (typeof window === 'undefined') {
    return [
      httpBatchLink({
        url: '/trpc',
        transformer: superjson,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          })
        },
      }),
    ]
  }

  const wsClient = createWSClient({
    url: '/trpc',
  })

  return [
    splitLink({
      condition(op) {
        return op.type === 'subscription'
      },
      true: wsLink({
        client: wsClient,
        transformer: superjson,
      }),
      false: httpBatchLink({
        url: 'http://localhost:8080/trpc',
        transformer: superjson,
        fetch(url, options) {
          return fetch(url, {
            ...options,
            credentials: 'include',
          })
        },
      }),
    }),
  ]
}

export const client = createTRPCClient<AppRouter>({
  links: getLinks(),
})
