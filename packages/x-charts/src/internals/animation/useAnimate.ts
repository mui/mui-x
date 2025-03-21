'use client';
import * as React from 'react';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION_JS } from './animation';
import { Transition } from './Transition';
import { shallowEqual } from '../shallowEqual';

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

  useEnhancedEffect(() => {
    lastPropsRef.current = props;
  }, [props]);

  useEnhancedEffect(() => {
    if (skip) {
      transitionRef.current?.finish();
    } else {
      transitionRef.current?.resume();
    }
  }, [skip]);

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

        // If props aren't the same, stop the transition and start a new animation.
        transitionRef.current?.stop();
      }

      // If it's a different element, stop the transition of the last element and start a new animation.
      if (lastElement) {
        transitionRef.current?.stop();
      }

      elementRef.current = element;

      animate(element);
    },
    [animate, props],
  );

  return setRef;
}
