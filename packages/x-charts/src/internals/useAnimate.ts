'use client';
import * as React from 'react';
import { Transition } from './Transition';
import { shallowEqual } from './shallowEqual';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION_JS } from '../constants';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

export function useAnimate<Props extends {}, Elem extends Element>(
  props: Props,
  {
    createInterpolator,
    applyProps,
    skip,
    initialProps,
  }: {
    createInterpolator: (lastProps: Props, newProps: Props) => (t: number) => Props;
    applyProps: (element: Elem, props: Props) => void;
    skip?: boolean;
    initialProps?: Props;
  },
) {
  const lastInterpolatedPropsRef = React.useRef(initialProps ?? props);
  const transitionRef = React.useRef<Transition>(null);
  const elementRef = React.useRef<Elem>(null);
  const lastPropsRef = React.useRef(props);

  useIsomorphicLayoutEffect(() => {
    lastPropsRef.current = props;
  }, [props]);

  const animate = React.useCallback(
    (element: Elem) => {
      const lastInterpolatedProps = lastInterpolatedPropsRef.current;
      const interpolate = createInterpolator(lastInterpolatedProps, props);
      transitionRef.current = new Transition(
        skip ? 0 : ANIMATION_DURATION_MS,
        ANIMATION_TIMING_FUNCTION_JS,
        (t) => {
          const interpolatedProps = interpolate(t);

          lastInterpolatedPropsRef.current = interpolatedProps;

          applyProps(element, interpolatedProps);
        },
      );
    },
    [applyProps, createInterpolator, props, skip],
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

        // If props aren't the same, stop the transition and fall through to start a new animation.
        transitionRef.current?.stop();
      }

      // If it's a different element, stop the transition of the last element.
      if (lastElement) {
        transitionRef.current?.stop();
      }

      animate(element);

      elementRef.current = element;
    },
    [animate, props],
  );

  return setRef;
}
