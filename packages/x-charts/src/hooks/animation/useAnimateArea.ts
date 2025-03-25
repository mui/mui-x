import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import useForkRef from '@mui/utils/useForkRef';
import * as React from 'react';
import { useAnimate } from '../../internals/animation/useAnimate';
import type { AnimatedAreaProps } from '../../LineChart';

type UseAnimateAreaParams = Pick<AnimatedAreaProps, 'd' | 'skipAnimation'> & {
  ref?: React.Ref<SVGPathElement>;
};
type UseAnimatedAreaReturn = {
  ref: React.Ref<SVGPathElement>;
  d: string;
};

/** Animates an area of a line chart using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export function useAnimateArea(props: UseAnimateAreaParams): UseAnimatedAreaReturn {
  const ref = useAnimate(
    { d: props.d },
    {
      createInterpolator: (lastProps, newProps) => {
        const interpolate = interpolateString(lastProps.d, newProps.d);
        return (t) => ({ d: interpolate(t) });
      },
      applyProps: (element: SVGPathElement, { d }) => element.setAttribute('d', d),
      skip: props.skipAnimation,
    },
  );

  return { ref: useForkRef(ref, props.ref), d: props.d };
}
