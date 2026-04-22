import * as React from 'react'
import { Dialog as DialogPrimitive } from 'radix-ui'

import { cn } from '~/lib/utils'
import { XIcon } from '@phosphor-icons/react'

function Dialog(props: React.ComponentProps<typeof DialogPrimitive.Root>) {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />
}

function DialogTrigger(props: React.ComponentProps<typeof DialogPrimitive.Trigger>) {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
}

function DialogPortal(props: React.ComponentProps<typeof DialogPrimitive.Portal>) {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
}

function DialogClose(props: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />
}

function DialogOverlay({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      data-slot="dialog-overlay"
      className={cn(
        'fixed inset-0 z-50 bg-background/80 backdrop-blur-xs',
        'data-open:animate-in data-open:fade-in-0',
        'data-closed:animate-out data-closed:fade-out-0',
        className
      )}
      {...props}
    />
  )
}

function DialogContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content>) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        data-slot="dialog-content"
        className={cn(
          'fixed left-1/2 top-1/2 z-50 w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2',
          'rounded-2xl border border-border bg-card shadow-lg outline-hidden',
          'data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-open:slide-in-from-top-2',
          'data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 data-closed:slide-out-to-top-2',
          className
        )}
        {...props}
      >
        {children}
        <DialogClose
          className={cn(
            'absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-md',
            'text-muted-foreground hover:text-foreground hover:bg-muted transition-colors',
            'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring'
          )}
          aria-label="Close"
        >
          <XIcon className="h-4 w-4" />
        </DialogClose>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
}

function DialogHeader(props: React.ComponentProps<'div'>) {
  return <div data-slot="dialog-header" className={cn('px-5 pt-5', props.className)} {...props} />
}

function DialogTitle(props: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn('text-[14px] font-extrabold tracking-[1.5px] uppercase', props.className)}
      {...props}
    />
  )
}

function DialogDescription(props: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn('mt-1 text-[12px] text-muted-foreground', props.className)}
      {...props}
    />
  )
}

function DialogFooter(props: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn('px-5 pb-5 pt-4 flex items-center justify-end gap-2', props.className)}
      {...props}
    />
  )
}

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}
