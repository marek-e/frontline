interface AuthErrorProps {
  message: string
}

export function AuthError({ message }: AuthErrorProps) {
  return (
    <div className="font-plex text-[11px] text-red-400 bg-red-500/10 border border-red-500/20 px-3 py-2 leading-relaxed">
      {message}
    </div>
  )
}
