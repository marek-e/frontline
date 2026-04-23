import { Link } from '@tanstack/react-router'
import { cn } from '~/lib/utils'

type LogoSize = 'sm' | 'md' | 'lg'

const TEXT_SIZE: Record<LogoSize, string> = {
  sm: 'text-[16px]',
  md: 'text-[20px]',
  lg: 'text-[28px]',
}

const ICON_SIZE: Record<LogoSize, number> = {
  sm: 22,
  md: 28,
  lg: 40,
}

function LogoMark({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="2" y="14" width="18" height="20" fill="#c8372d" />
      <polygon points="20,14 30,24 20,34" fill="#c8372d" />
      <rect x="28" y="14" width="18" height="20" fill="#2d6fa8" />
      <polygon points="28,14 18,24 28,34" fill="#2d6fa8" />
      <line x1="23" y1="6" x2="25" y2="42" stroke="#c8922a" strokeWidth="2.5" />
    </svg>
  )
}

type LogoBase = { size?: LogoSize; showLabel?: boolean; className?: string }
type AsLink = LogoBase & React.ComponentProps<typeof Link>
type AsDiv = LogoBase & React.HTMLAttributes<HTMLDivElement> & { to?: never }
type LogoProps = AsLink | AsDiv

export function Logo({ size = 'md', showLabel = true, className, to, ...props }: LogoProps) {
  const iconSize = ICON_SIZE[size]
  const interactive = to !== undefined || !!(props as React.HTMLAttributes<HTMLDivElement>).onClick

  const cls = cn(
    'flex items-center gap-[10px] select-none',
    interactive &&
      'cursor-pointer transition-all duration-100 hover:bg-fl-raised rounded-md px-2 py-1.5',
    className
  )

  const content = (
    <>
      <LogoMark size={iconSize} />
      {showLabel && (
        <span
          className={cn(
            'font-oswald font-bold uppercase tracking-[-0.01em] text-fl-fg1',
            TEXT_SIZE[size]
          )}
        >
          FRONTLINE
        </span>
      )}
    </>
  )

  if (to !== undefined) {
    return (
      <Link
        to={to as React.ComponentProps<typeof Link>['to']}
        className={cls}
        {...(props as Omit<React.ComponentProps<typeof Link>, 'to' | 'className'>)}
      >
        {content}
      </Link>
    )
  }

  return (
    <div className={cls} {...(props as React.HTMLAttributes<HTMLDivElement>)}>
      {content}
    </div>
  )
}
