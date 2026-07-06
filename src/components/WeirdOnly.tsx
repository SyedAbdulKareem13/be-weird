"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useIsWeird } from "@/lib/mode-store";

/**
 * Architecture gate: the boring version is the skeleton; weird is progressive
 * enhancement. Wrap every heavy effect in this. Renders `fallback` (the
 * static semantic version) in boring mode and during SSR — so the server
 * always ships the readable resume, and the weird layer mounts client-side
 * only when allowed.
 */
export default function WeirdOnly({
  children,
  fallback = null,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  const isWeird = useIsWeird();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || !isWeird) return <>{fallback}</>;
  return <>{children}</>;
}
