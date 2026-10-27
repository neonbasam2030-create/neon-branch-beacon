export function ZeroLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="zero-tri" x1="10" y1="8" x2="54" y2="58" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="var(--neon)" />
          <stop offset="52%" stopColor="var(--neon-2)" />
          <stop offset="100%" stopColor="var(--neon-3)" />
        </linearGradient>
      </defs>
      <path d="M32 4 56 17.5v29L32 60 8 46.5v-29Z" stroke="url(#zero-tri)" strokeWidth="3.5" strokeLinejoin="round" />
      <ellipse cx="32" cy="32" rx="11.5" ry="14.5" stroke="currentColor" strokeWidth="3.5" transform="rotate(-18 32 32)" />
      <path d="M22.5 42.5 43 20" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
    </svg>
  );
}
