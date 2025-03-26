import * as React from 'react';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useIsHydrated } from '../useIsHydrated';
import { useAnimate } from '../../internals/animation/useAnimate';
import type { BarLabelProps } from '../../BarChart';

type UseAnimateBarLabelParams = Pick<
  BarLabelProps,
  'xOrigin' | 'yOrigin' | 'x' | 'y' | 'width' | 'height' | 'layout' | 'skipAnimation'
> & {
  ref?: React.Ref<SVGTextElement>;
};
type UseAnimateBarLabelReturn = {
  ref: React.Ref<SVGTextElement>;
} & Pick<BarLabelProps, 'x' | 'y' | 'width' | 'height'>;
type BarLabelInterpolatedProps = Pick<UseAnimateBarLabelParams, 'x' | 'y' | 'width' | 'height'>;

function barLabelPropsInterpolator(from: BarLabelInterpolatedProps, to: BarLabelInterpolatedProps) {
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

export function useAnimateBarLabel(props: UseAnimateBarLabelParams): UseAnimateBarLabelReturn {
  const isHydrated = useIsHydrated();
  const initialProps = {
    x: props.layout === 'vertical' ? props.x + props.width / 2 : props.xOrigin,
    y: props.layout === 'vertical' ? props.yOrigin : props.y + props.height / 2,
    width: props.width,
    height: props.height,
  };
  const currentProps = {
    x: props.x + props.width / 2,
    y: props.y + props.height / 2,
    width: props.width,
    height: props.height,
  };

  const ref = useAnimate(currentProps, {
    createInterpolator: barLabelPropsInterpolator,
    applyProps(element, animatedProps) {
      element.setAttribute('x', animatedProps.x.toString());
      element.setAttribute('y', animatedProps.y.toString());
      element.setAttribute('width', animatedProps.width.toString());
      element.setAttribute('height', animatedProps.height.toString());
    },
    initialProps,
    skip: props.skipAnimation,
  });

  const usedProps = props.skipAnimation || !isHydrated ? currentProps : initialProps;

  return {
    ref,
    x: usedProps.x,
    y: usedProps.y,
    width: usedProps.width,
    height: usedProps.height,
  };
}
