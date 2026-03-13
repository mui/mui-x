import type * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { useAnimate } from './useAnimate';
import type { PieArcProps } from '../../PieChart';
import { createInterpolator } from './common';

type UseAnimatePieArcParams = Pick<
  PieArcProps,
  | 'startAngle'
  | 'endAngle'
  | 'cornerRadius'
  | 'paddingAngle'
  | 'innerRadius'
  | 'outerRadius'
  | 'skipAnimation'
> & { ref?: React.Ref<SVGPathElement> };
type UseAnimatePieArcReturnValue = {
  ref: React.Ref<SVGPathElement>;
  d: string;
  visibility: 'hidden' | 'visible';
};
export type PieArcInterpolatedProps = Pick<
  UseAnimatePieArcParams,
  'startAngle' | 'endAngle' | 'innerRadius' | 'outerRadius' | 'paddingAngle' | 'cornerRadius'
>;

/** Animates a slice of a pie chart by increasing the start and end angles from the middle angle to their final values.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export function useAnimatePieArc(props: UseAnimatePieArcParams): UseAnimatePieArcReturnValue {
  const initialProps = {
    startAngle: (props.startAngle + props.endAngle) / 2,
    endAngle: (props.startAngle + props.endAngle) / 2,
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
    paddingAngle: props.paddingAngle,
    cornerRadius: props.cornerRadius,
  };

  return useAnimate(
    {
      startAngle: props.startAngle,
      endAngle: props.endAngle,
      innerRadius: props.innerRadius,
      outerRadius: props.outerRadius,
      paddingAngle: props.paddingAngle,
      cornerRadius: props.cornerRadius,
    },
    {
      createInterpolator: createInterpolator<PieArcInterpolatedProps>,
      transformProps: (p) => ({
        d: d3Arc().cornerRadius(p.cornerRadius)({
          padAngle: p.paddingAngle,
          innerRadius: p.innerRadius,
          outerRadius: p.outerRadius,
          startAngle: p.startAngle,
          endAngle: p.endAngle,
        })!,
        visibility: p.startAngle === p.endAngle ? ('hidden' as const) : ('visible' as const),
      }),
      applyProps(element, p) {
        element.setAttribute('d', p.d);
        element.setAttribute('visibility', p.visibility);
      },
      initialProps,
      skip: props.skipAnimation,
      ref: props.ref,
    },
  );
}
