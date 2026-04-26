import { Link } from '@tanstack/react-router'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'
import './cta-button.css'

const ctaButtonVariants = cva(
  'inline-flex items-center justify-center font-oswald font-semibold transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:pointer-events-none aria-disabled:opacity-40 aria-disabled:cursor-not-allowed aria-disabled:pointer-events-none',
  {
    variants: {
      variant: {
        primary:
          'cta-primary-radial uppercase tracking-[0.08em] leading-none text-white border border-fl-red-border shadow-[0_2px_12px_rgba(200,55,45,0.25)] hover:shadow-[0_2px_12px_rgba(200,55,45,0.5)]',
        blue: 'cta-blue-radial uppercase tracking-[0.08em] leading-none text-white border border-fl-blue-border shadow-[0_2px_12px_rgba(45,111,168,0.25)] hover:shadow-[0_2px_12px_rgba(45,111,168,0.5)]',
        outline:
          'cta-border-grow duration-[450ms] uppercase tracking-[0.08em] leading-none text-fl-fg3 border border-fl-border hover:border-transparent bg-fl-bg hover:bg-fl-raised hover:text-fl-fg1',
        ghost:
          'text-fl-fg4 hover:text-fl-fg2 bg-transparent hover:bg-fl-raised border border-transparent',
        link: 'font-barlow text-fl-gold font-semibold hover:text-fl-gold-h hover:underline transition-colors duration-150 p-0!',
      },
      size: {
        lg: 'px-10 py-3.5 text-lg',
        md: 'px-8 py-3 text-md',
        sm: 'px-5 py-2.5 text-sm',
        xs: 'px-4 py-2 text-xs',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

type Variants = VariantProps<typeof ctaButtonVariants>
type AsLink = Variants & React.ComponentProps<typeof Link>
type AsButton = Variants & React.ComponentProps<'button'> & { to?: never }
type CtaButtonProps = AsLink | AsButton

function CtaButton({ variant, size, className, to, ...props }: CtaButtonProps) {
  const cls = cn(ctaButtonVariants({ variant, size, className }))
  if (to !== undefined) {
    const { disabled, ...linkProps } = props as React.ComponentProps<typeof Link> & {
      disabled?: boolean
    }
    return (
      <Link
        to={to as React.ComponentProps<typeof Link>['to']}
        className={cls}
        aria-disabled={disabled || undefined}
        {...(linkProps as Omit<React.ComponentProps<typeof Link>, 'to' | 'className'>)}
      />
    )
  }
  return <button className={cls} {...(props as React.ComponentProps<'button'>)} />
}

export { CtaButton, ctaButtonVariants }
