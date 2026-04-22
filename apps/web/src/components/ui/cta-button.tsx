import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '~/lib/utils'
import './cta-button.css'

const ctaButtonVariants = cva(
  'inline-flex items-center justify-center font-oswald font-semibold uppercase tracking-[0.08em] leading-none transition-all duration-200 cursor-pointer',
  {
    variants: {
      variant: {
        primary:
          'cta-primary-radial text-white border border-fl-red-border shadow-[0_2px_12px_rgba(200,55,45,0.25)] hover:shadow-[0_2px_12px_rgba(200,55,45,0.5)]',
        outline:
          'cta-border-grow duration-[450ms] text-fl-fg3 border border-fl-border hover:border-transparent bg-transparent hover:bg-fl-raised hover:text-fl-fg1',
      },
      size: {
        md: 'px-8 py-[13px] text-[15px]',
        sm: 'px-5 py-[9px] text-[13px]',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

interface CtaButtonProps
  extends React.ComponentProps<'button'>, VariantProps<typeof ctaButtonVariants> {}

function CtaButton({ variant, size, className, ...props }: CtaButtonProps) {
  return <button className={cn(ctaButtonVariants({ variant, size, className }))} {...props} />
}

export { CtaButton, ctaButtonVariants }
