import { cn } from '~/lib/utils'

export type FeatureItem = {
  icon: string
  colorClass: string
  title: string
  desc: string
}

export function FeatureCard({ icon, colorClass, title, desc }: FeatureItem) {
  return (
    <div className="group px-7 py-8 bg-fl-surf border border-fl-border-s hover:bg-fl-raised hover:border-fl-border transition-all duration-200 cursor-default">
      <div
        className={cn(
          'font-oswald text-[32px] mb-4 transition-transform duration-200 group-hover:scale-110 inline-block',
          colorClass
        )}
      >
        {icon}
      </div>
      <div className="font-oswald text-md font-semibold uppercase tracking-[0.06em] text-fl-fg1 mb-3">
        {title}
      </div>
      <div className="font-barlow text-[14px] text-fl-fg3 leading-[1.65]">{desc}</div>
    </div>
  )
}
