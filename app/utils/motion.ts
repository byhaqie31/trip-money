/** Client-side check; on the server we treat motion as reduced (render static). */
export function prefersReducedMotion(): boolean {
  if (import.meta.server) return true
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
