import type { ReactNode } from "react";

type Props = {
  id: string;
  children: ReactNode;
  background?: ReactNode;
  className?: string;
};

export function SectionShell({ id, children, background, className }: Props) {
  return (
    <section id={id} className={`relative ${className ?? ""}`}>
      {background ? (
        <div
          data-section-background
          aria-hidden="true"
          className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
        >
          {background}
        </div>
      ) : null}
      <div className="mx-auto max-w-[1280px] px-6 py-16 md:py-24">
        {children}
      </div>
    </section>
  );
}
