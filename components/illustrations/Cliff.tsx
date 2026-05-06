type Props = { className?: string };

export function Cliff({ className }: Props) {
  return (
    <svg
      viewBox="0 0 1200 200"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
      fill="currentColor"
    >
      <polygon points="0,200 0,120 60,90 180,130 360,80 540,140 720,80 900,130 1080,70 1200,110 1200,200" />
    </svg>
  );
}
