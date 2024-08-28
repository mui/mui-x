import * as React from 'react';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { useSpring } from '@react-spring/web';

function usePrevious<T>(value: T) {
  const ref = React.useRef<{ currentPath: T; previousPath?: T }>({
    currentPath: value,
    previousPath: undefined,
  });
  if (ref.current.currentPath !== value) {
    ref.current = {
      currentPath: value,
      previousPath: ref.current.currentPath,
    };
  }

  return ref.current;
}

export const useAnimatedPath = (path: string, skipAnimation?: boolean) => {
  const memoryRef = usePrevious(path);

  const interpolator = React.useMemo(
    () =>
      memoryRef.previousPath
        ? interpolateString(memoryRef.previousPath, memoryRef.currentPath)
        : () => memoryRef.currentPath,
    [memoryRef.currentPath, memoryRef.previousPath],
  );

  const [{ value }] = useSpring(
    {
      from: { value: 0 },
      to: { value: 1 },
      reset: true,
      immediate: skipAnimation,
    },
    [memoryRef.currentPath],
  );

  return value.to(interpolator);
};
