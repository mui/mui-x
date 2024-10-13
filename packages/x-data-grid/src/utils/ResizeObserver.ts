/**
 * HACK: Minimal shim to get jsdom to work.
 */
export const ResizeObserver = (
  typeof globalThis.ResizeObserver !== 'undefined'
    ? globalThis.ResizeObserver
    : class ResizeObserver {
        observe() {}
        unobserve() {}
      }
) as typeof globalThis.ResizeObserver;
