export interface Cancelable {
  clear(): void;
}

// Corresponds to 10 frames at 60 Hz.
// A few bytes payload overhead when lodash/debounce is ~3 kB and debounce ~300 B.
export default function throttle<T extends (...args: any[]) => any>(func: T, wait = 166) {
  let timeout: ReturnType<typeof setTimeout>;
  let lastCall: number | null = null;

  function throttled(...args: Parameters<T>) {
    const later = () => {
      // @ts-ignore
      func.apply(this, args);
      lastCall = Date.now();
    };

    clearTimeout(timeout);
    if (lastCall === null || Date.now() - lastCall > wait) {
      later();
    } else {
      timeout = setTimeout(later, wait);
    }
  }

  throttled.clear = () => {
    clearTimeout(timeout);

    lastCall = null;
  };

  return throttled as T & Cancelable;
}
