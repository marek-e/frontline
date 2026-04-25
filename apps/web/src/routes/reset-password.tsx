import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPasswordPage } from '~/pages/reset-password/ResetPasswordPage'

export const Route = createFileRoute('/reset-password')({
  component: ResetPasswordPage,
  validateSearch: z.object({ token: z.string().optional() }),
})
