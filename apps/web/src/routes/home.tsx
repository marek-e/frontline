import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '~/pages/home/HomePage'
import { requireAuth } from '~/lib/require-auth'

export const Route = createFileRoute('/home')({
  beforeLoad: ({ context }) => requireAuth(context.auth, '/home'),
  component: HomePage,
})
