import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router'
import { NotFound } from '../components/NotFound'
import { ThemeProvider } from '../components/theme-provider'
import type { RouterContext } from '../router'
import '../styles/app.css'

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFound,
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        title: import.meta.env.VITE_APP_ENV === 'staging' ? 'Frontline [staging]' : 'Frontline',
      },
    ],
    links: [
      { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap',
      },
    ],
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
          <Outlet />
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  )
}
