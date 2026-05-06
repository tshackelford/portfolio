type Props = { className?: string };

export function Campfire({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <path d="M40 8 C 30 28, 50 32, 40 50 C 50 38, 60 42, 56 56 C 60 36, 50 22, 40 8 Z" fill="#b76346" />
      <path d="M40 22 C 34 36, 46 40, 40 52 C 48 42, 52 46, 50 56 C 50 40, 46 30, 40 22 Z" fill="#e8b582" />
      <rect x="14" y="62" width="52" height="4" rx="2" fill="#5a4a32" transform="rotate(-6 40 64)" />
      <rect x="14" y="62" width="52" height="4" rx="2" fill="#5a4a32" transform="rotate(6 40 64)" />
    </svg>
  );
}
