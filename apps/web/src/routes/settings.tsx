import { createFileRoute } from '@tanstack/react-router'
import { SettingsPage } from '~/pages/settings/SettingsPage'
import { requireAuth } from '~/lib/require-auth'

export const Route = createFileRoute('/settings')({
  beforeLoad: ({ context }) => requireAuth(context.auth, '/settings'),
  component: SettingsPage,
})
