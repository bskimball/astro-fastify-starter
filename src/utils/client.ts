import type { AppRouter } from '../api/router.ts'
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server'
import {
  createTRPCClient,
  httpBatchLink,
  createWSClient,
  wsLink,
  splitLink,
} from '@trpc/client'
import superjson from 'superjson'

type RouterInput = inferRouterInputs<AppRouter>
type RouterOutput = inferRouterOutputs<AppRouter>

type RandomNumberInput = RouterInput['randomNumber']
type RandomNumberOutput = RouterOutput['randomNumber']

const url = 'ws://localhost:8080/trpc'

const wsClient = createWSClient({
  url,
})

export const client = createTRPCClient<AppRouter>({
  links: [
    splitLink({
      condition(op) {
        return op.type === 'subscription'
      },
      true: wsLink({
        client: wsClient,
        transformer: superjson,
      }),
      false: httpBatchLink({
        url,
        transformer: superjson,
        // async headers() {
        //   return {
        //
        //   }
        // }
      }),
    }),
  ],
})
