import { createFileRoute } from '@tanstack/react-router'
import { SignupPage } from '~/pages/signup/SignupPage'

export const Route = createFileRoute('/signup')({
  component: SignupPage,
})
