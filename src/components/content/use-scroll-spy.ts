"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Returns the id of the section currently being read.
 *
 * Deliberately position-based rather than IntersectionObserver-based:
 * long editorial sections are frequently taller than the viewport, so
 * "which heading did I last pass" is the answer a reader expects, and it
 * stays correct when several sections intersect at once.
 */
export function useScrollSpy(ids: readonly string[], offset = 160) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const idsRef = useRef(ids);
  const key = ids.join("|");

  useEffect(() => {
    idsRef.current = ids;
  }, [ids]);

  useEffect(() => {
    const compute = () => {
      const list = idsRef.current;
      if (list.length === 0) return;

      // Bottom of the document always belongs to the last section,
      // otherwise short trailing sections can never become active.
      const atBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
      if (atBottom) {
        setActive(list[list.length - 1]);
        return;
      }

      let current = list[0];
      for (const id of list) {
        const element = document.getElementById(id);
        if (!element) continue;
        if (element.getBoundingClientRect().top - offset <= 0) current = id;
      }
      setActive(current);
    };

    compute();
    window.addEventListener("scroll", compute, { passive: true });
    window.addEventListener("resize", compute);
    return () => {
      window.removeEventListener("scroll", compute);
      window.removeEventListener("resize", compute);
    };
  }, [key, offset]);

  return active;
}
