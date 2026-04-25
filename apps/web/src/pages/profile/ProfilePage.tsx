import { useNavigate } from '@tanstack/react-router'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'
import { Avatar } from '~/components/Avatar/Avatar'
import { useAuth } from '~/hooks/useAuth'

export function ProfilePage() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()
  const user = session?.user

  if (!user) return null

  const username = (user as Record<string, unknown>).username as string | undefined
  const displayName = username ?? user.name ?? 'Soldier'
  const country = (user as Record<string, unknown>).country as string | undefined
  const bio = (user as Record<string, unknown>).bio as string | undefined

  async function handleSignOut() {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-fl-bg text-fl-fg2 font-barlow antialiased">
      <div className="h-[60px] flex items-center justify-between px-12 border-b border-fl-border bg-fl-bg">
        <Logo to="/" />
        <div className="flex items-center gap-4">
          <ThemeCycle />
          <CtaButton variant="link" size="sm" to="/settings">
            Settings
          </CtaButton>
          <CtaButton size="sm" onClick={handleSignOut}>
            Sign out
          </CtaButton>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="flex items-start gap-6 mb-10">
          <Avatar username={displayName} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="font-oswald font-bold text-[28px] uppercase text-fl-fg1 tracking-[-0.01em] mb-1">
              {displayName}
            </h1>
            {country && (
              <p className="font-plex text-[12px] text-fl-fg4 uppercase tracking-widest mb-2">
                {country}
              </p>
            )}
            {user.email && <p className="text-[13px] text-fl-fg3">{user.email}</p>}
          </div>
          <CtaButton size="sm" onClick={() => navigate({ to: '/settings' })}>
            Edit profile
          </CtaButton>
        </div>

        {bio && (
          <div className="border border-fl-border bg-fl-surf px-5 py-4 mb-8">
            <p className="text-[14px] text-fl-fg2 leading-relaxed">{bio}</p>
          </div>
        )}

        <div className="border border-fl-border bg-fl-surf">
          <div className="px-5 py-3 border-b border-fl-border">
            <h2 className="font-oswald font-semibold text-[13px] uppercase text-fl-fg3 tracking-widest">
              Stats
            </h2>
          </div>
          <div className="grid grid-cols-3 divide-x divide-fl-border">
            {[
              { label: 'Games', value: '0' },
              { label: 'Wins', value: '0' },
              { label: 'Rating', value: '—' },
            ].map(({ label, value }) => (
              <div key={label} className="px-5 py-4 text-center">
                <div className="font-oswald font-bold text-[24px] text-fl-fg1">{value}</div>
                <div className="font-plex text-[10px] text-fl-fg4 uppercase tracking-widest mt-1">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
