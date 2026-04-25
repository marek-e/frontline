import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import type { AuthContext } from './lib/require-auth'

export type RouterContext = {
  auth: AuthContext
}

export function getRouter() {
  return createRouter({
    routeTree,
    defaultPreload: 'intent',
    scrollRestoration: true,
    context: { auth: undefined } satisfies RouterContext,
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
