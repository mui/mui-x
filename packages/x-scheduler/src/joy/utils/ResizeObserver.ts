/**
 * Minimal shim for ResizeObserver to ensure compatibility in environments
 * where ResizeObserver is not available (e.g., jsdom in tests).
 *
 * - Uses the native ResizeObserver if present.
 * - Otherwise, provides a no-op class with the same interface to prevent errors.
 *
 * Import and use this instead of accessing window.ResizeObserver/globalThis.ResizeObserver directly.
 */
export const ResizeObserver = (
  typeof globalThis.ResizeObserver !== 'undefined'
    ? globalThis.ResizeObserver
    : class ResizeObserver {
        static observe() {}

        static unobserve() {}

        static disconnect() {}
      }
) as typeof globalThis.ResizeObserver;
