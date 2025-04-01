export interface Cancelable {
  clear(): void;
}

/**
 *  Creates a throttled function that only invokes `fn` at most once per `wait`.
 *
 * @example
 * ```ts
 * const throttled = throttle((value: number) => console.log(value), 100);
 * window.addEventListener('scroll', (e) => throttled(e.target.scrollTop));
 * ```
 *
 * @param fn Callback function
 * @return The throttled function
 */
export function throttle<T extends (...args: any[]) => any>(func: T, wait = 166) {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  let lastArgs: Parameters<T>;

  const later = () => {
    timeout = undefined;
    func(...lastArgs);
  };

  function throttled(...args: Parameters<T>) {
    lastArgs = args;
    if (timeout === undefined) {
      timeout = setTimeout(later, wait);
    }
  }

  throttled.clear = () => {
    clearTimeout(timeout);
    timeout = undefined;
  };

  return throttled as T & Cancelable;
}
