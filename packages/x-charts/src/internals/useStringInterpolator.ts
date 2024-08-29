import * as React from 'react';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';

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

export const useStringInterpolator = (path: string) => {
  const memoryRef = usePrevious(path);

  const interpolator = React.useMemo(
    () =>
      memoryRef.previousPath
        ? interpolateString(memoryRef.previousPath, memoryRef.currentPath)
        : () => memoryRef.currentPath,
    [memoryRef.currentPath, memoryRef.previousPath],
  );

  return interpolator;
};
