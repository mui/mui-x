import * as React from 'react';
import { interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { useAnimate } from './useAnimate';
import type { BarLabelProps } from '../../BarChart';

type UseAnimateBarLabelParams = Pick<
  BarLabelProps,
  | 'xOrigin'
  | 'yOrigin'
  | 'x'
  | 'y'
  | 'width'
  | 'height'
  | 'layout'
  | 'skipAnimation'
  | 'barLabelPlacement'
  | 'value'
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

  return (t: number) => ({
    x: interpolateX(t),
    y: interpolateY(t),
    width: interpolateWidth(t),
    height: interpolateHeight(t),
  });
}

/**
 * Animates a bar label from the start of the axis (x-axis for vertical layout, y-axis for horizontal layout) to the
 * center of the bar it belongs to.
 * The label is horizontally centered within the bar when the layout is vertical, and vertically centered for laid out
 * horizontally.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
export function useAnimateBarLabel(props: UseAnimateBarLabelParams): UseAnimateBarLabelReturn {
  const isNegativeValue = props.value !== null && props.value < 0;
  const isAbovePlacement = props.barLabelPlacement === 'above';

  const shouldPlaceBelow = isNegativeValue && isAbovePlacement;
  const shouldPlaceAbove = !isNegativeValue && isAbovePlacement;

  let initialY = 0;
  let currentY = 0;

  let initialX = 0;
  let currentX = 0;

  if (props.layout === 'vertical') {
    if (shouldPlaceBelow) {
      initialY = props.yOrigin + 8;
      currentY = props.y + props.height + 8;
    } else if (shouldPlaceAbove) {
      initialY = props.yOrigin - 8;
      currentY = props.y - 8;
    } else {
      initialY = props.yOrigin;
      currentY = props.y + props.height / 2;
    }
    initialX = props.x + props.width / 2;
    currentX = props.x + props.width / 2;
  }

  if (props.layout === 'horizontal') {
    if (shouldPlaceBelow) {
      initialX = props.xOrigin;
      currentX = props.x - 8;
    } else if (shouldPlaceAbove) {
      initialX = props.xOrigin;
      currentX = props.x + props.width + 8;
    } else {
      initialX = props.xOrigin;
      currentX = props.x + props.width / 2;
    }
    initialY = props.y + props.height / 2;
    currentY = props.y + props.height / 2;
  }

  const initialProps = {
    x: initialX,
    y: initialY,
    width: props.width,
    height: props.height,
  };
  const currentProps = {
    x: currentX,
    y: currentY,
    width: props.width,
    height: props.height,
  };

  return useAnimate(currentProps, {
    createInterpolator: barLabelPropsInterpolator,
    transformProps: (p) => p,
    applyProps(element, animatedProps) {
      element.setAttribute('x', animatedProps.x.toString());
      element.setAttribute('y', animatedProps.y.toString());
      element.setAttribute('width', animatedProps.width.toString());
      element.setAttribute('height', animatedProps.height.toString());
    },
    initialProps,
    skip: props.skipAnimation,
    ref: props.ref,
  });
}
