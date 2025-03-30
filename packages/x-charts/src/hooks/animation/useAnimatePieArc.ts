import * as React from 'react';
import { arc as d3Arc } from '@mui/x-charts-vendor/d3-shape';
import useForkRef from '@mui/utils/useForkRef';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '../../internals/animation/useAnimate';
import type { PieArcProps } from '../../PieChart';

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
type PieArcInterpolatedProps = Pick<
  UseAnimatePieArcParams,
  'startAngle' | 'endAngle' | 'innerRadius' | 'outerRadius' | 'paddingAngle' | 'cornerRadius'
>;

function pieArcPropsInterpolator(from: PieArcInterpolatedProps, to: PieArcInterpolatedProps) {
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

/** Animates a slice of a pie chart using a `path` element.
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
      createInterpolator: pieArcPropsInterpolator,
      applyProps(element, animatedProps) {
        element.setAttribute(
          'd',
          d3Arc()
            .cornerRadius(animatedProps.cornerRadius)({
              padAngle: animatedProps.paddingAngle,
              innerRadius: animatedProps.innerRadius,
              outerRadius: animatedProps.outerRadius,
              startAngle: animatedProps.startAngle,
              endAngle: animatedProps.endAngle,
            })!
            .toString(),
        );

        element.setAttribute(
          'visibility',
          animatedProps.startAngle === animatedProps.endAngle ? 'hidden' : 'visible',
        );
      },
      initialProps,
      skip: props.skipAnimation,
    },
  );

  const usedProps = props.skipAnimation ? props : initialProps;

  return {
    ref: useForkRef(ref, props.ref),
    d: d3Arc().cornerRadius(usedProps.cornerRadius)({
      padAngle: usedProps.paddingAngle,
      innerRadius: usedProps.innerRadius,
      outerRadius: usedProps.outerRadius,
      startAngle: usedProps.startAngle,
      endAngle: usedProps.endAngle,
    })!,
    visibility: usedProps.startAngle === usedProps.endAngle ? 'hidden' : 'visible',
  };
}
