import { useState } from 'react'
import { Logo } from '~/components/Logo/Logo'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { CtaButton } from '~/components/ui/cta-button'
import { InputField } from '~/components/ui/input-field'
import { AuthError } from '../login/_components/AuthError'
import { useAuth } from '~/hooks/useAuth'
import { updateProfile, changePassword } from '~/lib/auth-client'

export function SettingsPage() {
  const { session } = useAuth()
  const user = session?.user
  const country = (user as Record<string, unknown> | undefined)?.country as string | undefined
  const bio = (user as Record<string, unknown> | undefined)?.bio as string | undefined

  const [profileLoading, setProfileLoading] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileSaved, setProfileSaved] = useState(false)

  const [pwLoading, setPwLoading] = useState(false)
  const [pwError, setPwError] = useState<string | null>(null)
  const [pwSaved, setPwSaved] = useState(false)

  async function handleProfileSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileError(null)
    setProfileSaved(false)
    setProfileLoading(true)

    const form = e.currentTarget
    const newCountry = (form.elements.namedItem('country') as HTMLInputElement).value
    const newBio = (form.elements.namedItem('bio') as HTMLTextAreaElement).value

    const result = await updateProfile({
      country: newCountry || undefined,
      bio: newBio || undefined,
    })
    setProfileLoading(false)

    if (result.error) {
      setProfileError(result.error.message ?? 'Failed to save profile.')
      return
    }

    setProfileSaved(true)
  }

  async function handlePasswordChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPwError(null)
    setPwSaved(false)

    const form = e.currentTarget
    const currentPassword = (form.elements.namedItem('current') as HTMLInputElement).value
    const newPassword = (form.elements.namedItem('new') as HTMLInputElement).value
    const confirm = (form.elements.namedItem('confirm') as HTMLInputElement).value

    if (newPassword !== confirm) {
      setPwError('New passwords do not match.')
      return
    }

    setPwLoading(true)
    const result = await changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: false,
    })
    setPwLoading(false)

    if (result.error) {
      setPwError(result.error.message ?? 'Password change failed.')
      return
    }

    setPwSaved(true)
    form.reset()
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-fl-bg text-fl-fg2 font-barlow antialiased">
      <div className="h-[60px] flex items-center justify-between px-12 border-b border-fl-border bg-fl-bg">
        <Logo to="/" />
        <div className="flex items-center gap-4">
          <ThemeCycle />
          <CtaButton variant="link" size="sm" to="/profile">
            Profile
          </CtaButton>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-16 flex flex-col gap-10">
        <h1 className="font-oswald font-bold text-[28px] uppercase text-fl-fg1 tracking-[-0.01em]">
          Settings
        </h1>

        {/* Profile section */}
        <section className="border border-fl-border bg-fl-surf">
          <div className="px-5 py-3 border-b border-fl-border">
            <h2 className="font-oswald font-semibold text-[13px] uppercase text-fl-fg3 tracking-widest">
              Profile
            </h2>
          </div>
          <form onSubmit={handleProfileSave} className="px-5 py-5 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="block font-plex text-[10px] text-fl-fg4 uppercase tracking-[0.14em]">
                AVATAR
              </label>
              <p className="font-plex text-[11px] text-fl-fg4">Avatar upload coming soon.</p>
            </div>

            <InputField
              label="COUNTRY"
              name="country"
              placeholder="e.g. United States"
              defaultValue={country ?? ''}
            />

            <div>
              <label className="block font-plex text-[10px] text-fl-fg4 uppercase tracking-[0.14em] mb-1.5">
                BIO
              </label>
              <textarea
                name="bio"
                defaultValue={bio ?? ''}
                placeholder="Tell us about yourself…"
                rows={3}
                className="w-full bg-fl-raised font-barlow text-[14px] text-fl-fg2 placeholder:text-fl-fg4 px-3.5 py-[11px] border border-fl-border outline-none transition-all duration-200 caret-fl-gold focus:border-fl-gold focus:shadow-[0_0_0_2px_rgba(200,146,42,0.12)] resize-none"
              />
            </div>

            {profileError && <AuthError message={profileError} />}
            {profileSaved && <p className="font-plex text-[11px] text-green-400">Profile saved.</p>}

            <CtaButton type="submit" disabled={profileLoading} className="self-start">
              {profileLoading ? 'SAVING…' : 'SAVE PROFILE'}
            </CtaButton>
          </form>
        </section>

        {/* Account section */}
        <section className="border border-fl-border bg-fl-surf">
          <div className="px-5 py-3 border-b border-fl-border">
            <h2 className="font-oswald font-semibold text-[13px] uppercase text-fl-fg3 tracking-widest">
              Account
            </h2>
          </div>
          <div className="px-5 py-5 flex flex-col gap-6">
            <div>
              <label className="block font-plex text-[10px] text-fl-fg4 uppercase tracking-[0.14em] mb-1.5">
                EMAIL
              </label>
              <p className="font-barlow text-[14px] text-fl-fg2">{user.email}</p>
            </div>

            <form onSubmit={handlePasswordChange} className="flex flex-col gap-4">
              <h3 className="font-plex text-[10px] text-fl-fg4 uppercase tracking-[0.14em]">
                CHANGE PASSWORD
              </h3>
              <InputField
                label="CURRENT PASSWORD"
                name="current"
                type="password"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <InputField
                label="NEW PASSWORD"
                name="new"
                type="password"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
              <InputField
                label="CONFIRM NEW PASSWORD"
                name="confirm"
                type="password"
                placeholder="Repeat new password"
                autoComplete="new-password"
              />

              {pwError && <AuthError message={pwError} />}
              {pwSaved && <p className="font-plex text-[11px] text-green-400">Password updated.</p>}

              <CtaButton type="submit" disabled={pwLoading} className="self-start">
                {pwLoading ? 'UPDATING…' : 'CHANGE PASSWORD'}
              </CtaButton>
            </form>

            <div className="border-t border-fl-border pt-6">
              <h3 className="font-plex text-[10px] text-fl-fg4 uppercase tracking-[0.14em] mb-3">
                DANGER ZONE
              </h3>
              <CtaButton disabled className="opacity-40 cursor-not-allowed">
                Delete account
              </CtaButton>
              <p className="font-plex text-[10px] text-fl-fg4 mt-2">
                Account deletion coming soon.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
