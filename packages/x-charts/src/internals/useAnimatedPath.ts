import * as React from 'react';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { useSpring, to } from '@react-spring/web';

function usePrevious<T>(value: T) {
  const ref = React.useRef<T | null>(null);
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

// Taken from Nivo
export const useAnimatedPath = (path: string, skipAnimation?: boolean) => {
  const previousPath = usePrevious(path);
  const interpolator = React.useMemo(
    () => (previousPath ? interpolateString(previousPath, path) : () => path),
    [previousPath, path],
  );

  const { value } = useSpring({
    from: { value: 0 },
    to: { value: 1 },
    reset: true,
    immediate: skipAnimation,
  });

  return to([value], interpolator);
};
