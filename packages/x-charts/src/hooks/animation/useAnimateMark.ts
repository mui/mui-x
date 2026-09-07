import type * as React from 'react';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from './useAnimate';

type UseAnimateMarkParams = {
  x: number;
  y: number;
  skipAnimation?: boolean;
  ref?: React.Ref<SVGPathElement>;
};

type UseAnimateMarkReturn = {
  ref: React.Ref<SVGPathElement>;
  transform: string;
};

type MarkInterpolatedProps = { x: number; y: number };

function markPropsInterpolator(from: MarkInterpolatedProps, to: MarkInterpolatedProps) {
  const interpolateX = interpolateNumber(from.x, to.x);
  const interpolateY = interpolateNumber(from.y, to.y);

  return (t: number) => ({
    x: interpolateX(t),
    y: interpolateY(t),
  });
}

/**
 * Animates the position of a line chart mark.
 *
 * The mark is placed with the SVG `transform` attribute, in `viewBox` units, because Safari resolves CSS pixel
 * transforms of SVG children against the viewport instead of the scaled `viewBox`, which moves the mark away from the
 * line under browser zoom. See https://github.com/mui/mui-x/issues/23377.
 *
 * Safari cannot transition the `transform` attribute with CSS, so the animation runs in JavaScript.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
export function useAnimateMark(props: UseAnimateMarkParams): UseAnimateMarkReturn {
  return useAnimate(
    { x: props.x, y: props.y },
    {
      createInterpolator: markPropsInterpolator,
      transformProps: (p) => ({ transform: `translate(${p.x} ${p.y})` }),
      applyProps(element, animatedProps) {
        element.setAttribute('transform', animatedProps.transform);
      },
      skip: props.skipAnimation,
      ref: props.ref,
    },
  );
}
