export function CornerBrackets({ color = '#c8922a', size = 14 }: { color?: string; size?: number }) {
  const base: React.CSSProperties = { position: 'absolute', width: size, height: size }
  return (
    <>
      <div
        style={{
          ...base,
          top: -1,
          left: -1,
          borderTop: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
        }}
      />
      <div
        style={{
          ...base,
          top: -1,
          right: -1,
          borderTop: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
        }}
      />
      <div
        style={{
          ...base,
          bottom: -1,
          left: -1,
          borderBottom: `2px solid ${color}`,
          borderLeft: `2px solid ${color}`,
        }}
      />
      <div
        style={{
          ...base,
          bottom: -1,
          right: -1,
          borderBottom: `2px solid ${color}`,
          borderRight: `2px solid ${color}`,
        }}
      />
    </>
  )
}
