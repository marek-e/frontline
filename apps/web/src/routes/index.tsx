import { createFileRoute, redirect } from '@tanstack/react-router'
import { LandingPage } from '~/pages/landing/LandingPage'

export const Route = createFileRoute('/')({
  beforeLoad: ({ context }) => {
    if (context.auth?.data?.user) {
      redirect({ to: '/home' })
    }
  },
  component: LandingPage,
})
