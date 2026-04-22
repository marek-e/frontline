import { createFileRoute } from '@tanstack/react-router'
import { PlayLocal } from '~/pages/PlayLocal'

export const Route = createFileRoute('/play/local')({
  component: PlayLocal,
})
