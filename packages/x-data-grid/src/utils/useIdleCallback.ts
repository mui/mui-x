import useLazyRef from '@mui/utils/useLazyRef';

/*
 * NOTE: Safari doesn't support `requestIdleCallback` so we need to include a shim.
 */

const requestIdleCallback =
  globalThis.requestIdleCallback ??
  function requestIdleCallback(fn) {
    const start = Date.now();
    return setTimeout(() => {
      fn({
        didTimeout: false,
        timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
      });
    }, 0);
  };

const cancelIdleCallback =
  globalThis.cancelIdleCallback ??
  function cancelIdleCallback(id) {
    clearTimeout(id);
  };

/**
 * Hook to schedule idle callbacks. Requesting a new one will cancel the old one.
 */
export function useIdleCallback() {
  return useLazyRef(createIdleCallback).current;
}

function createIdleCallback() {
  let id = 0;

  const cancel = () => {
    if (id) {
      cancelIdleCallback(id);
      id = 0;
    }
  };

  const request = (fn: Parameters<typeof requestIdleCallback>[0]) => {
    cancel();

    id = requestIdleCallback((deadline) => {
      id = 0;
      fn(deadline);
    });
  };

  return {
    request,
    cancel,
  };
}
