/* eslint-disable */

/**
 * HACK: Minimal shim to get jsdom to work.
 */
export const ResizeObserver = (
  typeof globalThis.ResizeObserver !== 'undefined'
    ? globalThis.ResizeObserver
    : class ResizeObserver {
        observe() {}
        unobserve() {}
        disconnect() {}
      }
) as typeof globalThis.ResizeObserver;
