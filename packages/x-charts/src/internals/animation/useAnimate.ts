'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import useForkRef from '@mui/utils/useForkRef';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION_JS } from './animation';
import { Transition } from './Transition';
import { shallowEqual } from '../shallowEqual';

/** Animates a ref. The animation can be skipped by setting {@link skip} to true.
 *
 * - If {@link skip} is false, a transition will be started.
 * - If {@link skip} is true and no transition is in progress, no transition will be started and {@link applyProps} will
 *   never be called.
 * - If {@link skip} becomes true and a transition is in progress, the transition will immediately end and
 *   {@link applyProps} be called with the final value.
 * */
export function useAnimate<Props extends {}, Elem extends Element>(
  props: Props,
  {
    createInterpolator,
    applyProps,
    skip,
    initialProps = props,
  }: {
    createInterpolator: (lastProps: Props, newProps: Props) => (t: number) => Props;
    applyProps: (element: Elem, props: Props) => void;
    skip?: boolean;
    initialProps?: Props;
  },
) {
  const lastInterpolatedPropsRef = React.useRef(initialProps);
  const transitionRef = React.useRef<Transition>(null);
  const elementRef = React.useRef<Elem>(null);
  const lastPropsRef = React.useRef(props);

  useEnhancedEffect(() => {
    lastPropsRef.current = props;
  }, [props]);

  useEnhancedEffect(() => {
    if (skip) {
      transitionRef.current?.finish();
      transitionRef.current = null;
      elementRef.current = null;
      lastInterpolatedPropsRef.current = props;
    }
  }, [props, skip]);

  const animate = React.useCallback(
    (element: Elem) => {
      const lastInterpolatedProps = lastInterpolatedPropsRef.current;
      const interpolate = createInterpolator(lastInterpolatedProps, props);
      transitionRef.current = new Transition(
        ANIMATION_DURATION_MS,
        ANIMATION_TIMING_FUNCTION_JS,
        (t) => {
          const interpolatedProps = interpolate(t);

          lastInterpolatedPropsRef.current = interpolatedProps;

          applyProps(element, interpolatedProps);
        },
      );
    },
    [applyProps, createInterpolator, props],
  );

  const setRef = React.useCallback(
    (element: Elem | null) => {
      if (element === null) {
        transitionRef.current?.stop();
        return;
      }

      const lastElement = elementRef.current;

      if (lastElement === element) {
        // If it's the same element and same props, resume the transition.
        if (shallowEqual(lastPropsRef.current, props)) {
          transitionRef.current?.resume();
          return;
        }

        // If props aren't the same, stop the transition and start a new animation.
        transitionRef.current?.stop();
      }

      // If it's a different element, stop the transition of the last element and start a new animation.
      if (lastElement) {
        transitionRef.current?.stop();
      }

      elementRef.current = element;

      if (transitionRef.current || !skip) {
        animate(element);
      }
    },
    [animate, props, skip],
  );

  return setRef;
}

interface UseAnimateRefParams<Props extends {}, Elem extends Element, T extends {} = Props> {
  createInterpolator: (lastProps: Props, newProps: Props) => (t: number) => Props;
  transformProps: (props: Props) => T;
  applyProps: (element: Elem, props: T) => void;
  skip?: boolean;
  initialProps?: Props;
  ref?: React.Ref<Elem>;
}

type UseAnimateRefReturn<Elem extends Element, T extends {}> = Omit<T, 'ref'> & {
  ref: React.Ref<Elem>;
};

export function useAnimateRef<Props extends {}, Elem extends Element, T extends {} = Props>(
  props: Props,
  {
    createInterpolator,
    transformProps,
    applyProps,
    skip,
    initialProps = props,
    ref,
  }: UseAnimateRefParams<Props, Elem, T>,
): UseAnimateRefReturn<Elem, T> {
  const transform = transformProps ?? ((p) => p);

  const animateRef = useAnimate<Props, Elem>(props, {
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
