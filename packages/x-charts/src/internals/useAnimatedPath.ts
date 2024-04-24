import * as React from 'react';
import { interpolateString } from 'd3-interpolate';
import { useSpringRef, useSpring, to } from '@react-spring/web';

// Taken from Nivo
export const useAnimatedPath = (path: string, skipAnimation?: boolean) => {
  const previousPathRef = React.useRef<string | null>(null);
  const currentPathRef = React.useRef<string | null>(path);

  const api = useSpringRef();

  React.useEffect(() => {
    if (previousPathRef.current !== path) {
      // Only start the animation if the previouse path is different.
      // Avoid re-animating if the props is updated with the same value.u
      api.start();
    }
    if (currentPathRef.current !== path) {
      previousPathRef.current = currentPathRef.current;
      currentPathRef.current = path;
    }
  }, [api, path]);

  const { value } = useSpring({
    ref: api,
    from: { value: 0 },
    to: { value: 1 },
    reset: true,
    immediate: skipAnimation,
  });

  const interpolation = (t: number) => {
    if (previousPathRef.current === null) {
      return path;
    }
    return interpolateString(previousPathRef.current, path)(t);
  };

  return to([value], interpolation);
};
