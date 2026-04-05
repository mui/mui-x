import type * as React from 'react';
import { useAnimate } from './useAnimate';
import type { BarProps } from '../../BarChart/AnimatedBarElement';
import { createInterpolator } from './common';

type UseAnimateBarParams = Pick<
  BarProps,
  'x' | 'y' | 'xOrigin' | 'yOrigin' | 'width' | 'height' | 'skipAnimation' | 'layout'
> & {
  ref?: React.Ref<SVGRectElement>;
};
type UseAnimateBarReturnValue = {
  ref: React.Ref<SVGRectElement>;
} & Pick<BarProps, 'x' | 'y' | 'width' | 'height'>;
export type BarInterpolatedProps = Pick<UseAnimateBarParams, 'x' | 'y' | 'width' | 'height'>;

/**
 * Animates a bar from the start of the axis (x-axis for vertical layout, y-axis for horizontal layout) to its
 * final position.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
export function useAnimateBar(props: UseAnimateBarParams): UseAnimateBarReturnValue {
  const initialProps = {
    x: props.layout === 'vertical' ? props.x : props.xOrigin,
    y: props.layout === 'vertical' ? props.yOrigin : props.y,
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
      createInterpolator: createInterpolator<BarInterpolatedProps>,
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
