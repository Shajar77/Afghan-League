// Typed Lenis smooth-scroll accessor utility.
// Replaces scattered (window as any).__lenis casts throughout the codebase.
import type Lenis from 'lenis'

type LenisWindow = Window & typeof globalThis & { __lenis?: Lenis }

/** Returns the active Lenis instance attached to window, or null if not initialised. */
export function getLenis(): Lenis | null {
  return (window as LenisWindow).__lenis ?? null
}

/** Scroll to position 0 (page top) using Lenis if available, otherwise native scroll. */
export function scrollToTop(immediate = true): void {
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(0, { immediate })
  } else {
    window.scrollTo(0, 0)
  }
}

/** Scroll to an element using Lenis if available, otherwise native scroll. */
export function scrollToElement(el: Element | null, offset = 0, immediate = true): void {
  if (!el) return
  const lenis = getLenis()
  if (lenis) {
    lenis.scrollTo(el as HTMLElement, { immediate, offset })
  } else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: y, behavior: 'auto' })
  }
}
