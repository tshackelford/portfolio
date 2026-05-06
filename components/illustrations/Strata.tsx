type Props = { className?: string };

export function Strata({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <rect x="0" y="10"  width="80" height="14" fill="#b76346" />
      <rect x="0" y="26"  width="80" height="10" fill="#e8b582" />
      <rect x="0" y="38"  width="80" height="18" fill="#8c3e28" />
      <rect x="0" y="58"  width="80" height="12" fill="#c87a52" />
    </svg>
  );
}
