import { cn } from '~/lib/utils'

interface InputFieldProps extends React.ComponentProps<'input'> {
  label: string
}

export function InputField({ label, className, id, ...props }: InputFieldProps) {
  const fieldId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  return (
    <div>
      <label
        htmlFor={fieldId}
        className="block font-plex text-[10px] text-fl-fg4 uppercase tracking-[0.14em] mb-1.5"
      >
        {label}
      </label>
      <input
        id={fieldId}
        className={cn(
          'w-full bg-fl-raised font-barlow text-[14px] text-fl-fg2 placeholder:text-fl-fg4',
          'px-3.5 py-[11px] border border-fl-border outline-none transition-all duration-200',
          'caret-fl-gold focus:border-fl-gold focus:shadow-[0_0_0_2px_rgba(200,146,42,0.12)]',
          className
        )}
        {...props}
      />
    </div>
  )
}
