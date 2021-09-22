// Base on @material-ui/utils/debounce,
// but as a hook that clears its own timeout on unmount.
import * as React from 'react';

export default function useThrottle(func, wait = 166) {
  const timeout = React.useRef(null);
  const shouldWait = React.useRef(false);

  const throttled = React.useCallback(
    (...args) => {
      if (!shouldWait.current) {
        func(...args);
        shouldWait.current = true;
        timeout.current = setTimeout(() => {
          shouldWait.current = false;
        }, wait);
      }
    },
    [func, wait],
  );

  throttled.clear = () => {
    clearTimeout(timeout.current);
  };

  React.useEffect(() => {
    return () => {
      clearTimeout(timeout.current);
    };
  }, []);

  return throttled;
}
