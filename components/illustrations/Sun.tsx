type Props = { className?: string };

export function Sun({ className }: Props) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={className}
      fill="currentColor"
    >
      <circle cx="50" cy="50" r="32" />
      <circle cx="50" cy="50" r="40" fillOpacity="0.18" />
    </svg>
  );
}
