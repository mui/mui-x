import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import * as React from 'react';
import { useAnimate } from '@mui/x-charts/hooks/animation/useAnimate';
import type { AnimatedLineProps } from '../../LineChart';

type UseAnimateLineParams = Pick<AnimatedLineProps, 'd' | 'skipAnimation'> & {
  ref?: React.Ref<SVGPathElement>;
};

type UseAnimatedReturnValue = {
  ref: React.Ref<SVGPathElement>;
  d: string;
};

/** Animates a line of a line chart using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export function useAnimateLine(props: UseAnimateLineParams): UseAnimatedReturnValue {
  return useAnimate(
    { d: props.d },
    {
      createInterpolator: (lastProps, newProps) => {
        const interpolate = interpolateString(lastProps.d, newProps.d);
        return (t) => ({ d: interpolate(t) });
      },
      applyProps: (element: SVGPathElement, { d }) => element.setAttribute('d', d),
      skip: props.skipAnimation,
      transformProps: (p) => p,
      ref: props.ref,
    },
  );
}
