import useForkRef from '@mui/utils/useForkRef';
import * as React from 'react';
import { useAnimateInternal } from '../../internals/animation/useAnimateInternal';

export interface UseAnimateParams<Props extends {}, Elem extends Element, T extends {} = Props> {
  /**
   * Function that returns the interpolation function for animating props.
   *
   * @param {object} lastProps Props to animate from, i.e., props when the animation was last stopped. If this is the first
   * animation, this value be `initialProps`.
   * @param {object} newProps Props to animate to.
   *
   * @returns {function} Interpolation function that takes a time value between 0 and 1 and returns the interpolated
   * props at time t. This function is called on every frame of the animation.
   */
  createInterpolator: (lastProps: Props, newProps: Props) => (t: number) => Props;
  /**
   * Transforms the interpolated props to be passed to `applyProps`, which usually means transforming them to element
   * attributes, e.g., transforming an array of points into a `d` attribute for a path.
   *
   * @param {object} props The interpolated props.
   *
   * @returns {object} The transformed props.
   */
  transformProps: (props: Props) => T;
  /**
   * Applies the transformed props to the element. Usually this will be a call to `element.setAttribute("x", x)` or
   * to `element.style.width = width` so that updating the element does not go through the React lifecycle (i.e., not
   * causing a re-render), with the objective of improving performance.
   *
   * This function is called on every frame of the animation.
   * @param {Element} element The element to apply the props to.
   * @param {object} props The transformed props to apply to the element.
   */
  applyProps: (element: Elem, props: T) => void;
  /**
   * If `true`, the animation will be skipped and the final props will be applied immediately.
   */
  skip?: boolean;
  /**
   * Initial props to animate from. If not provided, defaults to the props passed as the first argument of `useAnimate`.
   */
  initialProps?: Props;
  /**
   * Optional ref to merge with the ref returned from this hook.
   */
  ref?: React.Ref<Elem>;
}

export type UseAnimateReturn<Elem extends Element, T extends {}> = Omit<T, 'ref'> & {
  /**
   * Ref to be passed to the element to animate.
   */
  ref: React.Ref<Elem>;
};

/**
 * Hook to customize the animation of an element.
 * Animates a ref from `initialProps` to `props`.
 *
 * @param {object} props The props to animate to.
 *
 * @returns an object containing a ref that should be passed to the element to animate and the transformed props.
 * If `skip` is true, the transformed props are the `props` to animate to; if it is false, the transformed props are the
 * `initialProps`.
 *
 * The animated props are only accessible in `applyProps`. The props returned from this hook are not animated.
 *
 * When an animation starts, an interpolator is created using `createInterpolator`.
 * On every animation frame:
 * 1. The interpolator is called to get the interpolated props;
 * 2. `transformProps` is called to transform the interpolated props;
 * 3. `applyProps` is called to apply the transformed props to the element.
 *
 * If `props` change while an animation is progress, the animation will continue towards the new `props`.
 *
 * The animation can be skipped by setting `skip` to true. If a transition is in progress, it will immediately end
 * and `applyProps` be called with the final value. If there isn't a transition in progress, a new one won't be
 * started and `applyProps` will not be called.
 * */
export function useAnimate<Props extends {}, Elem extends Element, T extends {} = Props>(
  props: Props,
  {
    createInterpolator,
    transformProps,
    applyProps,
    skip,
    initialProps = props,
    ref,
  }: UseAnimateParams<Props, Elem, T>,
): UseAnimateReturn<Elem, T> {
  const transform = transformProps ?? ((p) => p);

  const animateRef = useAnimateInternal<Props, Elem>(props, {
    initialProps,
    createInterpolator,
    applyProps: (element, animatedProps) => applyProps(element, transform(animatedProps)),
    skip,
  });

  const usedProps = skip ? props : initialProps;

  return {
    ...transformProps(usedProps),
    ref: useForkRef(animateRef, ref),
  };
}
