import {
  PlusIcon,
  TrashIcon,
  GearIcon,
  CheckIcon,
  CaretDownIcon,
  PencilSimpleIcon,
  ArrowRightIcon,
  UserIcon,
  SignOutIcon,
  CopyIcon,
} from '@phosphor-icons/react'
import { useState } from 'react'

import { Button } from '~/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { CtaButton } from '~/components/ui/cta-button'
import { ThemeCycle } from '~/components/ui/theme-cycle'
import { ThemeToggle } from '~/components/ui/theme-toggle'
import { Logo } from '~/components/Logo/Logo'
import { cn } from '~/lib/utils'

const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const
const BUTTON_SIZES = ['xs', 'sm', 'default', 'lg'] as const
const ICON_SIZES = ['icon-xs', 'icon-sm', 'icon', 'icon-lg'] as const

export function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-fl-bg text-fl-fg2 font-barlow antialiased">
      <Header />

      <main className="max-w-[1200px] mx-auto px-12 py-10 space-y-16">
        <Section
          id="tokens"
          title="Design Tokens"
          subtitle="Semantic color surface, sourced from theme"
        >
          <Tokens />
        </Section>

        <Section id="typography" title="Typography" subtitle="Oswald · Barlow · IBM Plex Mono">
          <Typography />
        </Section>

        <Section id="button" title="Button" subtitle="Variants × sizes, icon + link combos">
          <ButtonShowcase />
        </Section>

        <Section
          id="cta-button"
          title="CTA Button"
          subtitle="Primary · Blue · Outline · Ghost · Link · lg / md / sm / xs"
        >
          <CtaButtonShowcase />
        </Section>

        <Section id="logo" title="Logo" subtitle="Link · onClick · mark only · with label">
          <LogoShowcase />
        </Section>

        <Section id="dialog" title="Dialog" subtitle="Modal, blocking interactions">
          <DialogShowcase />
        </Section>

        <Section id="dropdown" title="Dropdown Menu" subtitle="Items, checkbox, radio, submenu">
          <DropdownShowcase />
        </Section>

        <Section id="theme" title="Theme Switchers" subtitle="Cycle (inline) and Toggle (menu)">
          <ThemeShowcase />
        </Section>
      </main>

      <footer className="border-t border-fl-border py-6 px-12 text-[11px] font-plex uppercase tracking-[0.12em] text-fl-fg4">
        Frontline · Design System
      </footer>
    </div>
  )
}

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-fl-surf/90 backdrop-blur-md border-b border-fl-border">
      <div className="px-12 h-[60px] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo to="/" />
          <div className="w-px h-4 bg-fl-border-s" />
          <span className="font-oswald text-[14px] font-semibold uppercase tracking-[0.14em] text-fl-fg1">
            Design System
          </span>
        </div>
        <div className="flex items-center gap-2.5">
          <nav className="items-center gap-1 hidden md:flex">
            {[
              ['Tokens', 'tokens'],
              ['Type', 'typography'],
              ['Button', 'button'],
              ['CTA', 'cta-button'],
              ['Logo', 'logo'],
              ['Dialog', 'dialog'],
              ['Dropdown', 'dropdown'],
              ['Theme', 'theme'],
            ].map(([label, id]) => (
              <a
                key={id}
                href={`#${id}`}
                className="px-3 py-2 font-barlow text-[12px] font-medium uppercase tracking-[0.06em] text-fl-fg4 hover:text-fl-fg1 transition-colors"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="w-px h-4 bg-fl-border-s mx-2" />
          <ThemeCycle />
        </div>
      </div>
    </header>
  )
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id: string
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-fl-border-s">
        <h2 className="font-oswald text-[22px] font-semibold uppercase tracking-[0.14em] text-fl-fg1">
          {title}
        </h2>
        {subtitle && (
          <span className="font-plex text-[11px] uppercase tracking-[0.14em] text-fl-fg4">
            {subtitle}
          </span>
        )}
      </div>
      <div className="space-y-8">{children}</div>
    </section>
  )
}

function SubHead({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-plex text-[10px] font-semibold uppercase tracking-[0.18em] text-fl-fg4 mb-3">
      {children}
    </h3>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('border border-fl-border bg-fl-surf/40 p-5', 'rounded-none', className)}>
      {children}
    </div>
  )
}

// --- Tokens -----------------------------------------------------------------

function Swatch({ token, cls, label }: { token: string; cls: string; label?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div
        className={cn('h-14 border border-fl-border-s', cls)}
        style={{ boxShadow: 'inset 0 0 0 1px rgb(0 0 0 / 0.04)' }}
      />
      <div className="flex flex-col">
        <span className="font-plex text-[11px] text-fl-fg2">{label ?? token}</span>
        <span className="font-plex text-[10px] text-fl-fg4">{token}</span>
      </div>
    </div>
  )
}

function Tokens() {
  return (
    <div className="space-y-8">
      <div>
        <SubHead>Shadcn semantic</SubHead>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          <Swatch token="bg-background" cls="bg-background" />
          <Swatch token="bg-card" cls="bg-card" />
          <Swatch token="bg-popover" cls="bg-popover" />
          <Swatch token="bg-primary" cls="bg-primary" />
          <Swatch token="bg-secondary" cls="bg-secondary" />
          <Swatch token="bg-muted" cls="bg-muted" />
          <Swatch token="bg-accent" cls="bg-accent" />
          <Swatch token="bg-destructive" cls="bg-destructive" />
          <Swatch token="bg-border" cls="bg-border" />
          <Swatch token="bg-input" cls="bg-input" />
          <Swatch token="bg-ring" cls="bg-ring" />
          <Swatch token="bg-foreground" cls="bg-foreground" />
        </div>
      </div>

      <div>
        <SubHead>Frontline surface</SubHead>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          <Swatch token="bg-fl-bg" cls="bg-fl-bg" />
          <Swatch token="bg-fl-surf" cls="bg-fl-surf" />
          <Swatch token="bg-fl-raised" cls="bg-fl-raised" />
          <Swatch token="bg-fl-elev" cls="bg-fl-elev" />
          <Swatch token="bg-fl-border" cls="bg-fl-border" />
          <Swatch token="bg-fl-border-st" cls="bg-fl-border-st" />
        </div>
      </div>

      <div>
        <SubHead>Factions</SubHead>
        <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
          <Swatch token="bg-fl-red" cls="bg-fl-red" />
          <Swatch token="bg-fl-red-h" cls="bg-fl-red-h" />
          <Swatch token="bg-fl-blue" cls="bg-fl-blue" />
          <Swatch token="bg-fl-blue-h" cls="bg-fl-blue-h" />
          <Swatch token="bg-fl-gold" cls="bg-fl-gold" />
          <Swatch token="bg-fl-gold-h" cls="bg-fl-gold-h" />
          <Swatch token="bg-red-faction" cls="bg-red-faction" />
          <Swatch token="bg-blue-faction" cls="bg-blue-faction" />
          <Swatch token="bg-gold" cls="bg-gold" />
          <Swatch token="bg-success" cls="bg-success" />
          <Swatch token="bg-warning" cls="bg-warning" />
          <Swatch token="bg-danger" cls="bg-danger" />
        </div>
      </div>

      <div>
        <SubHead>Foreground ramp</SubHead>
        <div className="grid grid-cols-4 gap-3">
          {['fl-fg1', 'fl-fg2', 'fl-fg3', 'fl-fg4'].map((t) => (
            <Card key={t} className="flex items-center justify-between">
              <span className={cn(`text-${t}`, 'font-barlow text-[14px]')}>
                The quick brown fox
              </span>
              <span className="font-plex text-[10px] text-fl-fg4">{t}</span>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// --- Typography -------------------------------------------------------------

function Typography() {
  return (
    <div className="space-y-6">
      <Card>
        <div className="font-oswald text-[48px] font-semibold uppercase tracking-[0.04em] text-fl-fg1 leading-none">
          Hold The Line
        </div>
        <div className="font-plex text-[11px] uppercase tracking-[0.14em] text-fl-fg4 mt-2">
          font-oswald · display 48/semibold
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="font-oswald text-[24px] font-semibold uppercase tracking-[0.08em] text-fl-fg1">
            Section Heading
          </div>
          <div className="font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4 mt-2">
            font-oswald · 24/semibold/0.08em
          </div>
        </Card>
        <Card>
          <div className="font-barlow text-md text-fl-fg2 leading-[1.55]">
            Body — Barlow 15px. Command your units across the front and seize strategic objectives
            before reinforcements arrive.
          </div>
          <div className="font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4 mt-3">
            font-barlow · body 15/regular
          </div>
        </Card>
        <Card>
          <div className="font-barlow text-[13px] font-medium uppercase tracking-[0.06em] text-fl-fg3">
            Interactive Label · Play Ranked
          </div>
          <div className="font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4 mt-2">
            font-barlow · 13/medium/0.06em
          </div>
        </Card>
        <Card>
          <div className="font-plex text-[11px] uppercase tracking-[0.14em] text-fl-fg3">
            STATUS · OPERATIONAL · 14.2MS
          </div>
          <div className="font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4 mt-2">
            font-plex · 11/0.14em
          </div>
        </Card>
      </div>
    </div>
  )
}

// --- Button -----------------------------------------------------------------

function ButtonShowcase() {
  return (
    <div className="space-y-8">
      <div>
        <SubHead>Variants (size: default)</SubHead>
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            {BUTTON_VARIANTS.map((v) => (
              <Button key={v} variant={v}>
                {v}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <SubHead>Sizes (variant: default)</SubHead>
        <Card>
          <div className="flex flex-wrap items-end gap-3">
            {BUTTON_SIZES.map((s) => (
              <Button key={s} size={s}>
                {s}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <SubHead>Variant × Size matrix</SubHead>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-fl-border-s">
                  <th className="py-2 pr-3 font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4 font-normal">
                    variant \ size
                  </th>
                  {BUTTON_SIZES.map((s) => (
                    <th
                      key={s}
                      className="py-2 px-3 font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4 font-normal"
                    >
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BUTTON_VARIANTS.map((v) => (
                  <tr key={v} className="border-b border-fl-border-s last:border-0">
                    <td className="py-3 pr-3 font-plex text-[11px] uppercase tracking-[0.14em] text-fl-fg3">
                      {v}
                    </td>
                    {BUTTON_SIZES.map((s) => (
                      <td key={s} className="py-3 px-3">
                        <Button variant={v} size={s}>
                          Deploy
                        </Button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <SubHead>Icon sizes</SubHead>
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            {ICON_SIZES.map((s) => (
              <Button key={s} size={s} variant="outline" aria-label={s}>
                <GearIcon weight="bold" />
              </Button>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {BUTTON_VARIANTS.filter((v) => v !== 'link').map((v) => (
              <Button key={v} size="icon" variant={v} aria-label={v}>
                <PlusIcon weight="bold" />
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <SubHead>With icon (leading / trailing)</SubHead>
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Button>
              <PlusIcon data-icon="inline-start" weight="bold" />
              Enlist
            </Button>
            <Button variant="secondary">
              Continue
              <ArrowRightIcon data-icon="inline-end" weight="bold" />
            </Button>
            <Button variant="outline">
              <PencilSimpleIcon data-icon="inline-start" weight="bold" />
              Edit
            </Button>
            <Button variant="destructive">
              <TrashIcon data-icon="inline-start" weight="bold" />
              Delete
            </Button>
            <Button variant="ghost">
              <CheckIcon data-icon="inline-start" weight="bold" />
              Confirm
            </Button>
            <Button variant="link">
              Learn more
              <ArrowRightIcon data-icon="inline-end" weight="bold" />
            </Button>
          </div>
        </Card>
      </div>

      <div>
        <SubHead>States</SubHead>
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button disabled>Disabled</Button>
            <Button aria-invalid>Aria-invalid</Button>
            <Button variant="outline" disabled>
              Outline disabled
            </Button>
            <Button variant="destructive" aria-invalid>
              Destructive invalid
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}

// --- CTA Button -------------------------------------------------------------

const CTA_VARIANTS = ['primary', 'blue', 'outline', 'ghost', 'link'] as const
const CTA_SIZES = ['lg', 'md', 'sm', 'xs'] as const

function CtaButtonShowcase() {
  return (
    <div className="space-y-6">
      <div>
        <SubHead>Variants (size: md)</SubHead>
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <CtaButton variant="primary">ENLIST NOW</CtaButton>
            <CtaButton variant="blue">JOIN BLUE</CtaButton>
            <CtaButton variant="outline">WATCH LIVE</CtaButton>
            <CtaButton variant="ghost">GHOST</CtaButton>
            <CtaButton variant="link">Link action →</CtaButton>
          </div>
        </Card>
      </div>

      <div>
        <SubHead>Sizes (variant: primary)</SubHead>
        <Card>
          <div className="flex flex-wrap items-end gap-4">
            {CTA_SIZES.map((s) => (
              <div key={s} className="flex flex-col items-start gap-2">
                <CtaButton size={s}>DEPLOY {s}</CtaButton>
                <span className="font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4">
                  {s}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <SubHead>Variant × Size matrix</SubHead>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-fl-border-s">
                  <th className="py-2 pr-3 font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4 font-normal">
                    variant \ size
                  </th>
                  {CTA_SIZES.map((s) => (
                    <th
                      key={s}
                      className="py-2 px-3 font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4 font-normal"
                    >
                      {s}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CTA_VARIANTS.map((v) => (
                  <tr key={v} className="border-b border-fl-border-s last:border-0">
                    <td className="py-3 pr-3 font-plex text-[11px] uppercase tracking-[0.14em] text-fl-fg3">
                      {v}
                    </td>
                    {CTA_SIZES.map((s) => (
                      <td key={s} className="py-3 px-3">
                        <CtaButton variant={v} size={s}>
                          {v === 'link' ? 'Go →' : 'GO'}
                        </CtaButton>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <div>
        <SubHead>As link (to prop)</SubHead>
        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <CtaButton to="/signup">ENLIST NOW</CtaButton>
            <CtaButton variant="outline" size="sm" to="/login">
              LOG IN
            </CtaButton>
            <CtaButton variant="link" size="sm" to="/login">
              Already enlisted? Log in →
            </CtaButton>
          </div>
        </Card>
      </div>
    </div>
  )
}

// --- Logo -------------------------------------------------------------------

function LogoShowcase() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <SubHead>Default (with label)</SubHead>
          <div className="flex items-center gap-4 py-1">
            <Logo />
            <Logo size="lg" />
          </div>
          <p className="mt-3 font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4">
            Static · sm / lg sizes
          </p>
        </Card>

        <Card>
          <SubHead>Mark only (showLabel=false)</SubHead>
          <div className="flex items-center gap-4 py-1">
            <Logo showLabel={false} />
            <Logo showLabel={false} size="lg" />
          </div>
          <p className="mt-3 font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4">
            Icon-only · sm / lg sizes
          </p>
        </Card>

        <Card>
          <SubHead>Link variant (to prop)</SubHead>
          <div className="flex items-center gap-4 py-1">
            <Logo to="/" />
            <Logo to="/" showLabel={false} size="lg" />
          </div>
          <p className="mt-3 font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4">
            Renders as &lt;Link&gt; · hover bg + cursor
          </p>
        </Card>

        <Card>
          <SubHead>onClick variant</SubHead>
          <div className="flex items-center gap-4 py-1">
            <Logo onClick={() => {}} />
            <Logo onClick={() => {}} showLabel={false} size="lg" />
          </div>
          <p className="mt-3 font-plex text-[10px] uppercase tracking-[0.14em] text-fl-fg4">
            Renders as &lt;div&gt; · hover bg + cursor
          </p>
        </Card>
      </div>
    </div>
  )
}

// --- Dialog -----------------------------------------------------------------

function DialogShowcase() {
  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Open basic dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deploy Commander</DialogTitle>
              <DialogDescription>
                Assign your commander to the front line. This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="px-5 pt-3 pb-0 text-[13px] text-fl-fg3 font-barlow leading-[1.55]">
              Once deployed, your commander will engage all hostile units within a 3-square radius.
            </div>
            <DialogFooter>
              <Button variant="ghost">Cancel</Button>
              <Button>Deploy</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive">
              <TrashIcon data-icon="inline-start" weight="bold" />
              Destructive dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Forfeit match?</DialogTitle>
              <DialogDescription>
                You will be disqualified and your opponent awarded victory.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="ghost">Stay</Button>
              <Button variant="destructive">Forfeit</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Card>
  )
}

// --- Dropdown Menu ----------------------------------------------------------

function DropdownShowcase() {
  const [showStatus, setShowStatus] = useState(true)
  const [showPanel, setShowPanel] = useState(false)
  const [position, setPosition] = useState('bottom')

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Basic menu
              <CaretDownIcon data-icon="inline-end" weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserIcon weight="fill" />
                Profile
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <GearIcon weight="fill" />
                Settings
                <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CopyIcon weight="fill" />
                Copy invite
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">
              <SignOutIcon weight="fill" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Checkboxes
              <CaretDownIcon data-icon="inline-end" weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem checked={showStatus} onCheckedChange={setShowStatus}>
              Status bar
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem checked={showPanel} onCheckedChange={setShowPanel}>
              Activity panel
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem disabled>Minimap (soon)</DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Radio
              <CaretDownIcon data-icon="inline-end" weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuLabel>Panel position</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Submenu
              <CaretDownIcon data-icon="inline-end" weight="bold" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48">
            <DropdownMenuItem>New match</DropdownMenuItem>
            <DropdownMenuItem>Open replay</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Invite</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email…</DropdownMenuItem>
                <DropdownMenuItem>Copy link</DropdownMenuItem>
                <DropdownMenuItem>Share to Discord</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Abandon</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Card>
  )
}

// --- Theme ------------------------------------------------------------------

function ThemeShowcase() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <SubHead>ThemeCycle</SubHead>
        <div className="flex items-center gap-6">
          <ThemeCycle showLabel={false} />
          <ThemeCycle />
        </div>
        <p className="mt-4 font-barlow text-[13px] text-fl-fg3 leading-[1.55]">
          Inline cycle button. Click to step through{' '}
          <code className="font-plex">system → dark → light</code>.
        </p>
      </Card>
      <Card>
        <SubHead>ThemeToggle</SubHead>
        <div className="flex items-center gap-6">
          <ThemeToggle />
        </div>
        <p className="mt-4 font-barlow text-[13px] text-fl-fg3 leading-[1.55]">
          Icon button with dropdown menu. Explicit select{' '}
          <code className="font-plex">light / dark / system</code>.
        </p>
      </Card>
    </div>
  )
}
