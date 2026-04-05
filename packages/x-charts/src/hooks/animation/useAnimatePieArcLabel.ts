import type * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { useAnimate } from './useAnimate';
import type { PieArcLabelProps } from '../../PieChart';
import { createInterpolator } from './common';

type UseAnimatePieArcLabelParams = Pick<
  PieArcLabelProps,
  'startAngle' | 'endAngle' | 'arcLabelRadius' | 'cornerRadius' | 'paddingAngle' | 'skipAnimation'
> & {
  ref?: React.Ref<SVGTextElement>;
};
type UseAnimatePieArcLabelReturn = {
  ref: React.Ref<SVGTextElement>;
  x: number;
  y: number;
};
export type PieArcLabelInterpolatedProps = Pick<
  UseAnimatePieArcLabelParams,
  'startAngle' | 'endAngle' | 'arcLabelRadius' | 'paddingAngle' | 'cornerRadius'
>;

/** Animates the label of pie slice from its middle point to the centroid of the slice.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export function useAnimatePieArcLabel(
  props: UseAnimatePieArcLabelParams,
): UseAnimatePieArcLabelReturn {
  const initialProps = {
    startAngle: (props.startAngle + props.endAngle) / 2,
    endAngle: (props.startAngle + props.endAngle) / 2,
    arcLabelRadius: props.arcLabelRadius,
    paddingAngle: props.paddingAngle,
    cornerRadius: props.cornerRadius,
  };

  return useAnimate(
    {
      startAngle: props.startAngle,
      endAngle: props.endAngle,
      arcLabelRadius: props.arcLabelRadius,
      paddingAngle: props.paddingAngle,
      cornerRadius: props.cornerRadius,
    },
    {
      createInterpolator: createInterpolator<PieArcLabelInterpolatedProps>,
      transformProps: (animatedProps) => {
        const [x, y] = d3Arc().cornerRadius(animatedProps.cornerRadius).centroid({
          padAngle: animatedProps.paddingAngle,
          startAngle: animatedProps.startAngle,
          endAngle: animatedProps.endAngle,
          innerRadius: animatedProps.arcLabelRadius,
          outerRadius: animatedProps.arcLabelRadius,
        });

        return { x, y };
      },
      applyProps(element, { x, y }) {
        element.setAttribute('x', x.toString());
        element.setAttribute('y', y.toString());
      },
      initialProps,
      skip: props.skipAnimation,
      ref: props.ref,
    },
  );
}
