import * as React from 'react';
import { interpolateString } from 'd3-interpolate';
import { useSpring } from '@react-spring/web';

// Taken from Nivo
export const useAnimatedPath = (path: string, skipAnimation?: boolean) => {
  const previousPathRef = React.useRef<string | null>(null);
  const currentPathRef = React.useRef<string | null>(path);

  React.useEffect(() => {
    previousPathRef.current = currentPathRef.current;
    currentPathRef.current = path;
  }, [path]);

  const spring = useSpring({
    from: { value: 0 },
    to: { value: 1 },
    reset: true,
    immediate: skipAnimation,
    onResolve() {
      previousPathRef.current = path;
      currentPathRef.current = path;
    },
  });

  const interpolation = React.useMemo(() => {
    if (previousPathRef.current === null) {
      return () => path;
    }
    return interpolateString(previousPathRef.current, path);
  }, [path]);

  return spring.value.to(interpolation);
};
