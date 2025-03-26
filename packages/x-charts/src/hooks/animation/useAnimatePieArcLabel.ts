import * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import useForkRef from '@mui/utils/useForkRef';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useIsHydrated } from '../useIsHydrated';
import { useAnimate } from '../../internals/animation/useAnimate';
import type { PieArcLabelProps } from '../../PieChart';

type UseAnimatePieArcLabelParams = Pick<
  PieArcLabelProps,
  | 'startAngle'
  | 'endAngle'
  | 'cornerRadius'
  | 'paddingAngle'
  | 'innerRadius'
  | 'outerRadius'
  | 'skipAnimation'
> & { ref?: React.Ref<SVGTextElement> };
type UseAnimatePieArcLabelReturn = {
  ref: React.Ref<SVGTextElement>;
  x: number;
  y: number;
};
type PieArcLabelInterpolatedProps = Pick<
  UseAnimatePieArcLabelParams,
  'startAngle' | 'endAngle' | 'innerRadius' | 'outerRadius' | 'paddingAngle' | 'cornerRadius'
>;

function pieArcLabelPropsInterpolator(
  from: PieArcLabelInterpolatedProps,
  to: PieArcLabelInterpolatedProps,
) {
  const interpolateStartAngle = interpolateNumber(from.startAngle, to.startAngle);
  const interpolateEndAngle = interpolateNumber(from.endAngle, to.endAngle);
  const interpolateInnerRadius = interpolateNumber(from.innerRadius, to.innerRadius);
  const interpolateOuterRadius = interpolateNumber(from.outerRadius, to.outerRadius);
  const interpolatePaddingAngle = interpolateNumber(from.paddingAngle, to.paddingAngle);
  const interpolateCornerRadius = interpolateNumber(from.cornerRadius, to.cornerRadius);

  return (t: number) => {
    return {
      startAngle: interpolateStartAngle(t),
      endAngle: interpolateEndAngle(t),
      innerRadius: interpolateInnerRadius(t),
      outerRadius: interpolateOuterRadius(t),
      paddingAngle: interpolatePaddingAngle(t),
      cornerRadius: interpolateCornerRadius(t),
    };
  };
}

/** Animates the label of pie slice.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export function useAnimatePieArcLabel(
  props: UseAnimatePieArcLabelParams,
): UseAnimatePieArcLabelReturn {
  const isHydrated = useIsHydrated();
  const initialProps = {
    startAngle: (props.startAngle + props.endAngle) / 2,
    endAngle: (props.startAngle + props.endAngle) / 2,
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
    paddingAngle: props.paddingAngle,
    cornerRadius: props.cornerRadius,
  };

  const ref = useAnimate(
    {
      startAngle: props.startAngle,
      endAngle: props.endAngle,
      innerRadius: props.innerRadius,
      outerRadius: props.outerRadius,
      paddingAngle: props.paddingAngle,
      cornerRadius: props.cornerRadius,
    },
    {
      createInterpolator: pieArcLabelPropsInterpolator,
      applyProps(element, animatedProps) {
        const [x, y] = d3Arc().cornerRadius(animatedProps.cornerRadius).centroid({
          padAngle: animatedProps.paddingAngle,
          startAngle: animatedProps.startAngle,
          endAngle: animatedProps.endAngle,
          innerRadius: animatedProps.innerRadius,
          outerRadius: animatedProps.outerRadius,
        });

        element.setAttribute('x', x.toString());
        element.setAttribute('y', y.toString());
      },
      initialProps,
      skip: props.skipAnimation,
    },
  );

  const usedProps = props.skipAnimation || !isHydrated ? props : initialProps;

  const [x, y] = d3Arc().cornerRadius(usedProps.cornerRadius).centroid({
    padAngle: usedProps.paddingAngle,
    startAngle: usedProps.startAngle,
    endAngle: usedProps.endAngle,
    innerRadius: usedProps.innerRadius,
    outerRadius: usedProps.outerRadius,
  });

  return {
    ref: useForkRef(ref, props.ref),
    x,
    y,
  };
}
