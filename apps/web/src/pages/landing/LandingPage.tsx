import { LandingNav } from './_components/LandingNav'
import { Hero } from './_components/Hero'
import { StatsBar } from './_components/StatsBar'
import { Features } from './_components/Features'
import { FactionPick } from './_components/FactionPick'
import { Footer } from './_components/Footer'

export function LandingPage() {
  return (
    <div
      id="fl-scroll"
      className="min-h-screen overflow-y-auto bg-fl-bg text-fl-fg2 font-barlow antialiased"
    >
      <LandingNav />
      <Hero />
      <StatsBar />
      <Features />
      <FactionPick />
      <Footer />
    </div>
  )
}
