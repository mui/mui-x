import * as React from 'react';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { useSpring, to } from '@react-spring/web';

function usePrevious<T>(value: T) {
  const ref = React.useRef<{ current: T; previous?: T }>({
    current: value,
    previous: undefined,
  });
  React.useEffect(() => {
    ref.current = {
      current: value,
      previous: ref.current.current,
    };
  }, [value]);
  return ref.current;
}

export const useAnimatedPath = (path: string, skipAnimation?: boolean) => {
  const memoryRef = usePrevious(path);

  const interpolator = React.useMemo(
    () =>
      memoryRef.previous
        ? interpolateString(memoryRef.previous, memoryRef.current)
        : () => memoryRef.current,
    [memoryRef],
  );

  const [{ value }] = useSpring(
    {
      from: { value: 0 },
      to: { value: 1 },
      reset: true,
      immediate: skipAnimation,
    },
    [memoryRef.current],
  );

  return to([value], interpolator);
};
