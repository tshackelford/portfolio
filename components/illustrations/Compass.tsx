type Props = { className?: string };

export function Compass({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className}>
      <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="3" />
      <polygon points="40,16 46,40 40,64 34,40" fill="currentColor" />
      <circle cx="40" cy="40" r="3" fill="currentColor" />
    </svg>
  );
}
