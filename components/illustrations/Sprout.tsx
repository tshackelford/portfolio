type Props = { className?: string };

export function Sprout({ className }: Props) {
  return (
    <svg viewBox="0 0 80 80" aria-hidden="true" className={className} fill="currentColor">
      <path d="M40 70 V 40 C 40 28, 28 22, 18 22 C 18 36, 28 44, 40 44" />
      <path d="M40 44 C 40 32, 52 26, 62 26 C 62 38, 52 46, 40 46" />
      <rect x="38" y="68" width="4" height="8" />
    </svg>
  );
}
