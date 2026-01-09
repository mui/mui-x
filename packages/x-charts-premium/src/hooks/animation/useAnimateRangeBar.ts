import type * as React from 'react';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from '@mui/x-charts/hooks';
import { type AnimatedRangeBarElementProps } from '../../BarChartPremium/RangeBar/AnimatedRangeBarElement';

type UseAnimateRangeBarParams = Pick<
  AnimatedRangeBarElementProps,
  'x' | 'y' | 'xOrigin' | 'yOrigin' | 'width' | 'height' | 'skipAnimation' | 'layout'
> & {
  ref?: React.Ref<SVGRectElement>;
};
type UseAnimateRangeBarReturnValue = {
  ref: React.Ref<SVGRectElement>;
} & Pick<AnimatedRangeBarElementProps, 'x' | 'y' | 'width' | 'height'>;
type BarInterpolatedProps = Pick<UseAnimateRangeBarParams, 'x' | 'y' | 'width' | 'height'>;

function rangeBarPropsInterpolator(from: BarInterpolatedProps, to: BarInterpolatedProps) {
  const interpolateX = interpolateNumber(from.x, to.x);
  const interpolateY = interpolateNumber(from.y, to.y);
  const interpolateWidth = interpolateNumber(from.width, to.width);
  const interpolateHeight = interpolateNumber(from.height, to.height);

  return (t: number) => {
    return {
      x: interpolateX(t),
      y: interpolateY(t),
      width: interpolateWidth(t),
      height: interpolateHeight(t),
    };
  };
}

/**
 * Animates a range bar from its center outwards.
 * The animation only happens in the direction of the numerical axis (x-axis for vertical layout, y-axis for horizontal layout).
 * The other direction remains constant during the animation.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
export function useAnimateRangeBar(props: UseAnimateRangeBarParams): UseAnimateRangeBarReturnValue {
  const initialProps = {
    x: props.layout === 'vertical' ? props.x : props.x + props.width / 2,
    y: props.layout === 'vertical' ? props.y + props.height / 2 : props.y,
    width: props.layout === 'vertical' ? props.width : 0,
    height: props.layout === 'vertical' ? 0 : props.height,
  };

  return useAnimate(
    {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
    },
    {
      createInterpolator: rangeBarPropsInterpolator,
      applyProps(element, animatedProps) {
        element.setAttribute('x', animatedProps.x.toString());
        element.setAttribute('y', animatedProps.y.toString());
        element.setAttribute('width', animatedProps.width.toString());
        element.setAttribute('height', animatedProps.height.toString());
      },
      transformProps: (p) => p,
      initialProps,
      skip: props.skipAnimation,
      ref: props.ref,
    },
  );
}
