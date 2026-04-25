import { cn } from '~/lib/utils'

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-20 h-20 text-xl',
} as const

interface AvatarProps {
  username: string
  avatarUrl?: string | null
  size?: keyof typeof sizes
  className?: string
}

export function Avatar({ username, avatarUrl, size = 'md', className }: AvatarProps) {
  const initials = username.slice(0, 2).toUpperCase()

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        className={cn(sizes[size], 'rounded-full object-cover ring-2 ring-fl-border', className)}
      />
    )
  }

  return (
    <div
      className={cn(
        sizes[size],
        'rounded-full bg-fl-raised ring-2 ring-fl-border flex items-center justify-center font-oswald font-bold text-fl-gold',
        className
      )}
    >
      {initials}
    </div>
  )
}
