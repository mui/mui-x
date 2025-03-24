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
type PieArcInterpolatedProps = Pick<UseAnimatePieArcParams, 'startAngle' | 'endAngle'>;

function pieArcPropsInterpolator(from: PieArcInterpolatedProps, to: PieArcInterpolatedProps) {
  const interpolateStartAngle = interpolateNumber(from.startAngle, to.startAngle);
  const interpolateEndAngle = interpolateNumber(from.endAngle, to.endAngle);

  return (t: number) => {
    return {
      startAngle: interpolateStartAngle(t),
      endAngle: interpolateEndAngle(t),
    };
  };
}

/** Animates a slice of a pie chart using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export function useAnimatePieArc(props: UseAnimatePieArcParams): UseAnimatePieArcReturnValue {
  const [firstRender, setFirstRender] = React.useState(true);
  const initialProps = {
    startAngle: (props.startAngle + props.endAngle) / 2,
    endAngle: (props.startAngle + props.endAngle) / 2,
  };

  React.useEffect(() => {
    setFirstRender(false);
  }, []);

  const ref = useAnimate(
    { startAngle: props.startAngle, endAngle: props.endAngle },
    {
      createInterpolator: pieArcPropsInterpolator,
      applyProps(element, animatedProps) {
        element.setAttribute(
          'd',
          d3Arc()
            .cornerRadius(props.cornerRadius)({
              padAngle: props.paddingAngle,
              innerRadius: props.innerRadius,
              outerRadius: props.outerRadius,
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

  // Only use the initial props on the first render.
  const usedProps = !props.skipAnimation && firstRender ? initialProps : props;

  return {
    ref: useForkRef(ref, props.ref),
    d: d3Arc().cornerRadius(props.cornerRadius)({
      padAngle: props.paddingAngle,
      innerRadius: props.innerRadius,
      outerRadius: props.outerRadius,
      startAngle: usedProps.startAngle,
      endAngle: usedProps.endAngle,
    })!,
    visibility: props.startAngle === props.endAngle ? 'hidden' : 'visible',
  };
}
