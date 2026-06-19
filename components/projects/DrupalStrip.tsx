"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import Image from "next/image";
import type { DrupalSite } from "@/content/projects";

type Props = { sites: DrupalSite[] };

export function DrupalStrip({ sites }: Props) {
  const [focusIndex, setFocusIndex] = useState(0);
  const itemRefs = useRef<Array<HTMLElement | null>>([]);

  function moveFocus(next: number) {
    const wrapped = (next + sites.length) % sites.length;
    setFocusIndex(wrapped);
    itemRefs.current[wrapped]?.focus();
  }

  function handleKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        moveFocus(focusIndex + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        moveFocus(focusIndex - 1);
        break;
      case "Home":
        e.preventDefault();
        moveFocus(0);
        break;
      case "End":
        e.preventDefault();
        moveFocus(sites.length - 1);
        break;
    }
  }

  return (
    <ul
      role="list"
      onKeyDown={handleKeyDown}
      className="flex gap-3 overflow-x-auto pb-3 -mx-1 px-1"
      aria-label="Drupal sites"
    >
      {sites.map((s, i) => {
        const tabIndex = i === focusIndex ? 0 : -1;
        const inner = (
          <div className="relative w-full aspect-[4/3] overflow-hidden rounded-md bg-mesa/20">
            <Image
              src={s.thumbnail}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 200px"
              className="object-cover"
            />
            <span className="absolute bottom-1 left-1 right-1 bg-ink/70 text-bone text-[0.65rem] uppercase tracking-wide px-2 py-1 rounded">
              {s.name}
            </span>
          </div>
        );

        const setRef = (el: HTMLElement | null) => {
          itemRefs.current[i] = el;
        };

        return (
          <li
            key={s.name}
            className="flex-none w-40 transition-transform duration-200 hover:scale-105"
          >
            {s.liveUrl ? (
              <a
                ref={setRef}
                href={s.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={tabIndex}
                aria-label={s.name}
                className="block"
              >
                {inner}
              </a>
            ) : (
              <div
                ref={setRef}
                tabIndex={tabIndex}
                role="img"
                aria-label={s.name}
                className="block"
              >
                {inner}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
