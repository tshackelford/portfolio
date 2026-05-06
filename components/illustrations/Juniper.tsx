type Props = { className?: string };

export function Juniper({ className }: Props) {
  return (
    <svg viewBox="0 0 60 80" aria-hidden="true" className={className}>
      <ellipse cx="30" cy="34" rx="22" ry="28" fill="currentColor" />
      <rect x="26" y="58" width="8" height="22" rx="2" fill="#5a4a32" />
    </svg>
  );
}
