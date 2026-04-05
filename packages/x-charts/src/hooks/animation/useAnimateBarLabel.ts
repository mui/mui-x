import type * as React from 'react';
import { useAnimate } from './useAnimate';
import type { BarLabelProps } from '../../BarChart';
import { createInterpolator } from './common';

type UseAnimateBarLabelParams = Pick<
  BarLabelProps,
  'xOrigin' | 'yOrigin' | 'x' | 'y' | 'width' | 'height' | 'layout' | 'skipAnimation' | 'placement'
> & {
  ref?: React.Ref<SVGTextElement>;
};
type UseAnimateBarLabelReturn = {
  ref: React.Ref<SVGTextElement>;
} & Pick<BarLabelProps, 'x' | 'y' | 'width' | 'height'>;
export type BarLabelInterpolatedProps = Pick<
  UseAnimateBarLabelParams,
  'x' | 'y' | 'width' | 'height'
>;

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
  const { initialX, currentX, initialY, currentY } =
    props.placement === 'outside' ? getOutsidePlacement(props) : getCenterPlacement(props);

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
    createInterpolator: createInterpolator<BarLabelInterpolatedProps>,
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

const LABEL_OFFSET = 4;

function getCenterPlacement(props: UseAnimateBarLabelParams) {
  return {
    initialX: props.layout === 'vertical' ? props.x + props.width / 2 : props.xOrigin,
    initialY: props.layout === 'vertical' ? props.yOrigin : props.y + props.height / 2,
    currentX: props.x + props.width / 2,
    currentY: props.y + props.height / 2,
  };
}

function getOutsidePlacement(props: UseAnimateBarLabelParams) {
  let initialY = 0;
  let currentY = 0;

  let initialX = 0;
  let currentX = 0;

  if (props.layout === 'vertical') {
    const shouldPlaceAbove = props.y < props.yOrigin;

    if (shouldPlaceAbove) {
      initialY = props.yOrigin - LABEL_OFFSET;
      currentY = props.y - LABEL_OFFSET;
    } else {
      initialY = props.yOrigin + LABEL_OFFSET;
      currentY = props.y + props.height + LABEL_OFFSET;
    }

    return {
      initialX: props.x + props.width / 2,
      currentX: props.x + props.width / 2,
      initialY,
      currentY,
    };
  }

  const shouldPlaceToTheLeft = props.x < props.xOrigin;

  if (shouldPlaceToTheLeft) {
    initialX = props.xOrigin;
    currentX = props.x - LABEL_OFFSET;
  } else {
    initialX = props.xOrigin;
    currentX = props.x + props.width + LABEL_OFFSET;
  }

  return {
    initialX,
    currentX,
    initialY: props.y + props.height / 2,
    currentY: props.y + props.height / 2,
  };
}
