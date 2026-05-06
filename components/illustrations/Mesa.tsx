type Props = { className?: string };

export function Mesa({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 300"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <polygon points="0,300 0,200 80,160 200,160 230,200 480,200 510,170 700,170 730,200 1200,200 1200,300" />
    </svg>
  );
}
