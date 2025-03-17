'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { select } from '@mui/x-charts-vendor/d3-selection';
import { interrupt, Transition } from '@mui/x-charts-vendor/d3-transition';
import useForkRef from '@mui/utils/useForkRef';
import useId from '@mui/utils/useId';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION_JS } from '../constants';
import { AppearingMask } from './AppearingMask';
import type { LineElementOwnerState } from './LineElement';

export interface AnimatedLineProps extends React.ComponentPropsWithoutRef<'path'> {
  ownerState: LineElementOwnerState;
  d: string;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
}

function useAnimate<Props, Elem extends Element>(
  props: Props,
  {
    createInterpolator,
    applyProps,
    skip,
  }: {
    createInterpolator: (lastProps: Props, newProps: Props) => (t: number) => Props;
    applyProps: (element: Elem, props: Props) => void;
    skip?: boolean;
  },
) {
  const transitionName = `MuiUseAnimate-${useId()}`;
  /* A transition is interrupted when:
   * T1. The transitioned element changes;
   * T2. The transitioned element is unmounted;
   * T3. The component calling this hook is unmounted. */
  const lastInterpolatedProps = React.useRef(props);
  const transitionRef = React.useRef<Transition<Elem, unknown, null, undefined>>(null);
  const elementRef = React.useRef<Elem>(null);
  const elementUnmounted = React.useRef(false);

  React.useLayoutEffect(() => {
    return () => {
      /* T3. Stop the transition if the component that calls this hook is unmounted. */
      const lastElement = elementRef.current;

      if (lastElement) {
        interrupt(lastElement, transitionName);
      }
    };
  }, [transitionName]);

  /* T2. Interrupt the transition if the element is unmounted.
   *
   * `elementUnmounted` is when to true when a `setRef` is called with a non-null element. This is needed because
   * `setRef` can be called because the component using this hook re-renders, i.e., it isn't guaranteed to be called only
   *  when the underlying element changes.
   *  When `elementUnmounted` is true, it means `setRef` wasn't called with an element, so we must interrupt the
   *  transition.
   *
   * This runs on every render, so it must be light. */
  React.useLayoutEffect(() => {
    if (elementUnmounted.current) {
      const lastElement = elementRef.current;

      interrupt(lastElement, transitionName);
    }
  });

  const animate = React.useCallback(
    (element: Elem) => {
      transitionRef.current = select(element)
        .transition(transitionName)
        .duration(skip ? 0 : ANIMATION_DURATION_MS)
        .ease(ANIMATION_TIMING_FUNCTION_JS)
        .tween('animate', () => {
          const lastProps = lastInterpolatedProps.current;
          const interpolate = createInterpolator(lastProps, props);

          return function animateAt(t) {
            const interpolatedProps = interpolate(t);

            lastInterpolatedProps.current = interpolatedProps;

            applyProps(this, interpolatedProps);
          };
        });
    },
    [applyProps, createInterpolator, props, skip, transitionName],
  );

  React.useLayoutEffect(() => {
    const element = elementRef.current;

    if (element) {
      animate(element);
    }
  }, [animate]);

  const setRef = React.useCallback(
    (element: Elem | null) => {
      elementUnmounted.current = element === null;

      if (element === null) {
        return;
      }

      const lastElement = elementRef.current;

      // If it's the same element, there's nothing to do.
      if (lastElement === element) {
        return;
      }

      // T1. If it's a different element, interrupt the transition of the last element.
      if (lastElement) {
        interrupt(lastElement, transitionName);
      }

      animate(element);

      elementRef.current = element;
    },
    [animate, transitionName],
  );

  return setRef;
}

function useAnimatePath(props: Pick<AnimatedLineProps, 'd'>, { skip }: { skip?: boolean }) {
  return useAnimate(props.d, {
    createInterpolator: (lastD, newD) => interpolateString(lastD, newD),
    applyProps: (element: SVGPathElement, d) => element.setAttribute('d', d),
    skip,
  });
}

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [AnimatedLine API](https://mui.com/x/api/charts/animated-line/)
 */
const AnimatedLine = React.forwardRef<SVGPathElement, AnimatedLineProps>(
  function AnimatedLine(props, ref) {
    const { d, skipAnimation, ownerState, ...other } = props;

    const animateRef = useAnimatePath(props, { skip: props.skipAnimation });
    const forkRef = useForkRef(ref, animateRef);

    return (
      <AppearingMask skipAnimation={skipAnimation} id={`${ownerState.id}-line-clip`}>
        <path
          ref={forkRef}
          d={d}
          stroke={ownerState.gradientId ? `url(#${ownerState.gradientId})` : ownerState.color}
          strokeWidth={2}
          strokeLinejoin="round"
          fill="none"
          filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
          opacity={ownerState.isFaded ? 0.3 : 1}
          {...other}
        />
      </AppearingMask>
    );
  },
);

AnimatedLine.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  d: PropTypes.string.isRequired,
  ownerState: PropTypes.shape({
    classes: PropTypes.object,
    color: PropTypes.string.isRequired,
    gradientId: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isFaded: PropTypes.bool.isRequired,
    isHighlighted: PropTypes.bool.isRequired,
  }).isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
} as any;

export { AnimatedLine };
