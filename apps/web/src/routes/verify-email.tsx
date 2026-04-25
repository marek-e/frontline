import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { VerifyEmailPage } from '~/pages/verify-email/VerifyEmailPage'

export const Route = createFileRoute('/verify-email')({
  component: VerifyEmailPage,
  validateSearch: z.object({ email: z.string().optional() }),
})
