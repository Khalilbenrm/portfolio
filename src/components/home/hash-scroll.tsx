"use client";

import { useEffect } from "react";

// A hash link to this page (e.g. "/#contact") clicked from a *different*
// route only changes the URL — the browser's native hash-scroll doesn't
// reliably fire across a client-side route transition, so once this page's
// sections exist in the DOM, scroll to whichever one the hash names.
export function HashScroll() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const raf = requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return null;
}
