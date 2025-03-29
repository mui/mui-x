import useForkRef from '@mui/utils/useForkRef';
import * as React from 'react';
import { useAnimateInternal } from '../../internals/animation/useAnimateInternal';

export interface UseAnimateParams<Props extends {}, Elem extends Element, T extends {} = Props> {
  createInterpolator: (lastProps: Props, newProps: Props) => (t: number) => Props;
  transformProps: (props: Props) => T;
  applyProps: (element: Elem, props: T) => void;
  skip?: boolean;
  initialProps?: Props;
  ref?: React.Ref<Elem>;
}

export type UseAnimateReturn<Elem extends Element, T extends {}> = Omit<T, 'ref'> & {
  ref: React.Ref<Elem>;
};

/** Animates a ref from {@link initialProps} to {@link props}. If {@link props} change, the animation will resume towards
 * the new {@link props}. Use this hook if you want to customize the animation of an element.
 *
 * When an animation starts, an interpolator is created using {@link createInterpolator}. The interpolator is called
 * on every frame of the animation and the result is passed to {@link transformProps}, which will transform the props to
 * the final props that will be passed to {@link applyProps}.
 * Finally, {@link applyProps} is called with the element and the transformed props so that the element can be updated.
 *
 * This hook returns a ref that should be passed to the element to animate. Additionally, the transformed props will
 * also be returned. If {@link skip} is true, then the final props will be returned. Otherwise, the final props are
 * returned. The animated props are only accessible in {@link applyProps}. The props returned from this hook are not
 * animated.
 *
 * The animation can be skipped by setting {@link skip} to true.
 *
 * - If {@link skip} is false, a transition will be started.
 * - If {@link skip} is true and no transition is in progress, no transition will be started and {@link applyProps} will
 *   never be called.
 * - If {@link skip} becomes true and a transition is in progress, the transition will immediately end and
 *   {@link applyProps} be called with the final value.
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
