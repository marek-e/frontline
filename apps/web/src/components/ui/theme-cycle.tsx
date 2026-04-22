import { SunIcon, MoonIcon, MonitorIcon } from '@phosphor-icons/react'
import { useTheme } from '~/components/theme-provider'

const THEME_CYCLE = ['system', 'dark', 'light'] as const
type ThemeVal = (typeof THEME_CYCLE)[number]

interface ThemeCycleProps {
  showLabel?: boolean
}

export function ThemeCycle({ showLabel = true }: ThemeCycleProps) {
  const { theme, setTheme } = useTheme()

  function cycle() {
    const idx = THEME_CYCLE.indexOf(theme as ThemeVal)
    setTheme(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length])
  }

  const Icon = theme === 'light' ? SunIcon : theme === 'dark' ? MoonIcon : MonitorIcon
  const label = theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'

  return (
    <button
      onClick={cycle}
      aria-label={`Theme: ${label}. Click to cycle.`}
      title={label}
      className="flex items-center gap-1.5 px-2.5 py-2 text-fl-fg4 hover:text-fl-fg1 transition-colors duration-150 cursor-pointer group overflow-hidden"
    >
      <div className="relative size-[15px] overflow-hidden">
        <Icon
          key={theme}
          size={15}
          weight="bold"
          className="absolute inset-0 animate-in slide-in-from-bottom-3 fade-in duration-200 ease-out group-hover:scale-110 transition-transform"
        />
      </div>
      {showLabel && (
        <span
          key={theme}
          className="font-barlow text-[11px] font-medium uppercase tracking-[0.08em] opacity-60 group-hover:opacity-100 transition-opacity animate-in slide-in-from-bottom-3 fade-in duration-200 ease-out"
        >
          {label}
        </span>
      )}
    </button>
  )
}
