import * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from './useAnimate';

interface UseAnimateGaugeValueArcParams {
  ref?: React.Ref<SVGPathElement>;

  startAngle: number;
  endAngle: number;
  cornerRadius: number;
  innerRadius: number;
  outerRadius: number;

  skipAnimation: boolean;
}
type UseAnimateGaugeValueArcReturnValue = {
  ref: React.Ref<SVGPathElement>;
  d: string;
};
type GaugeValueArcInterpolatedProps = Pick<
  UseAnimateGaugeValueArcParams,
  'startAngle' | 'endAngle' | 'innerRadius' | 'outerRadius' | 'cornerRadius'
>;

function gaugeValueArcPropsInterpolator(
  from: GaugeValueArcInterpolatedProps,
  to: GaugeValueArcInterpolatedProps,
) {
  const interpolateStartAngle = interpolateNumber(from.startAngle, to.startAngle);
  const interpolateEndAngle = interpolateNumber(from.endAngle, to.endAngle);
  const interpolateInnerRadius = interpolateNumber(from.innerRadius, to.innerRadius);
  const interpolateOuterRadius = interpolateNumber(from.outerRadius, to.outerRadius);
  const interpolateCornerRadius = interpolateNumber(from.cornerRadius, to.cornerRadius);

  return (t: number) => {
    return {
      startAngle: interpolateStartAngle(t),
      endAngle: interpolateEndAngle(t),
      innerRadius: interpolateInnerRadius(t),
      outerRadius: interpolateOuterRadius(t),
      cornerRadius: interpolateCornerRadius(t),
    };
  };
}

/** Animates a arc of a gauge chart by increasing the `endAngle` from the start angle to the end angle.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export function useAnimateGaugeValueArc(
  props: UseAnimateGaugeValueArcParams,
): UseAnimateGaugeValueArcReturnValue {
  return useAnimate(
    {
      startAngle: props.startAngle,
      endAngle: props.endAngle,
      innerRadius: props.innerRadius,
      outerRadius: props.outerRadius,
      cornerRadius: props.cornerRadius,
    },
    {
      createInterpolator: gaugeValueArcPropsInterpolator,
      transformProps: (p) => ({
        d: d3Arc().cornerRadius(p.cornerRadius)({
          innerRadius: p.innerRadius,
          outerRadius: p.outerRadius,
          startAngle: p.startAngle,
          endAngle: p.endAngle,
        })!,
      }),
      applyProps(element, p) {
        element.setAttribute('d', p.d);
      },
      initialProps: {
        startAngle: props.startAngle,
        endAngle: props.startAngle,
        innerRadius: props.innerRadius,
        outerRadius: props.outerRadius,
        cornerRadius: props.cornerRadius,
      },
      skip: props.skipAnimation,
      ref: props.ref,
    },
  );
}
