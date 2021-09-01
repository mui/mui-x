// Base on @material-ui/utils/debounce,
// but as a hook that clears its own timeout on unmount.
import { useEffect } from 'react';

export default function useThrottle(func, wait = 166) {
  let timeout;
  let shouldWait = false;
  function throttled(...args) {
    if (!shouldWait) {
      func.apply(this, args);
      shouldWait = true;
      timeout = setTimeout(() => {
        shouldWait = false;
      }, wait);
    }
  }

  throttled.clear = () => {
    clearTimeout(timeout);
  };

  useEffect(() => {
    return () => {
      clearTimeout(timeout);
    };
  }, [timeout]);

  return throttled;
}
