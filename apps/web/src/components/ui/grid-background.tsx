interface GridBackgroundProps {
  dotOpacity?: number
  vignette?: boolean
}

export function GridBackground({ dotOpacity = 35, vignette = false }: GridBackgroundProps) {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--fl-fg4) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: dotOpacity / 100,
        }}
      />
      {vignette && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 30% 50%, transparent, var(--fl-bg) 80%)',
          }}
        />
      )}
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-transparent via-fl-red to-transparent" />
      <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-linear-to-b from-transparent via-fl-blue to-transparent" />
    </>
  )
}
