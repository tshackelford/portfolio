type Props = { className?: string };

export function Ridge({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 300"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <polygon points="0,300 0,180 120,90 220,150 380,40 560,170 720,90 900,160 1080,80 1200,140 1200,300" />
    </svg>
  );
}
