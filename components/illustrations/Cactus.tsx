type Props = { className?: string };

export function Cactus({ className }: Props) {
  return (
    <svg viewBox="0 0 60 100" aria-hidden="true" className={className} fill="currentColor">
      <rect x="26" y="20" width="10" height="80" rx="5" />
      <rect x="10" y="40" width="8" height="22" rx="4" />
      <rect x="14" y="38" width="8" height="6" rx="2" />
      <rect x="44" y="48" width="8" height="20" rx="4" />
      <rect x="46" y="46" width="8" height="6" rx="2" />
    </svg>
  );
}
