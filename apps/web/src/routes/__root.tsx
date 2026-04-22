import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'
import { ThemeProvider } from '../components/theme-provider'
import { ThemeToggle } from '../components/ui/theme-toggle'
import '../styles/app.css'

export const Route = createRootRoute({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Frontline' },
    ],
    links: [{ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
  }),
  component: RootDocument,
})

function RootDocument() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <ThemeProvider defaultTheme="system" storageKey="theme">
          <div className="fixed top-3 right-3 z-50">
            <ThemeToggle />
          </div>
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
