import { createFileRoute } from '@tanstack/react-router'
import { ProfilePage } from '~/pages/profile/ProfilePage'
import { requireAuth } from '~/lib/require-auth'

export const Route = createFileRoute('/profile')({
  beforeLoad: ({ context }) => requireAuth(context.auth, '/profile'),
  component: ProfilePage,
})
