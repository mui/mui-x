'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { select } from '@mui/x-charts-vendor/d3-selection';
import { interrupt, Transition } from '@mui/x-charts-vendor/d3-transition';
import useForkRef from '@mui/utils/useForkRef';
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

const TRANSITION_NAME = 'MuiAnimatedLine-transition';
function useAnimatePath(props: Pick<AnimatedLineProps, 'd'>, { skip }: { skip?: boolean }) {
  /* A transition is interrupted when:
   * T1. The transitioned element changes;
   * T2. The transitioned element is unmounted;
   * T3. The component calling this hook is unmounted. */
  const lastInterpolatedDRef = React.useRef(props.d);
  const transitionRef = React.useRef<Transition<SVGPathElement, unknown, null, undefined>>(null);
  const elementRef = React.useRef<SVGPathElement>(null);
  const elementUnmounted = React.useRef(false);

  React.useLayoutEffect(() => {
    return () => {
      /* T3. Stop the transition if the component that calls this hook is unmounted. */
      const lastElement = elementRef.current;

      if (lastElement) {
        interrupt(lastElement, TRANSITION_NAME);
      }
    };
  }, []);

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

      interrupt(lastElement, TRANSITION_NAME);
    }
  });

  const animate = React.useCallback(
    (element: SVGPathElement) => {
      const lastInterpolatedD = lastInterpolatedDRef.current;
      const stringInterpolator = interpolateString(lastInterpolatedD, props.d);

      transitionRef.current = select(element)
        .transition(TRANSITION_NAME)
        .duration(skip ? 0 : ANIMATION_DURATION_MS)
        .ease(ANIMATION_TIMING_FUNCTION_JS)
        .attrTween('d', () => (t) => {
          const interpolatedD = stringInterpolator(t);

          lastInterpolatedDRef.current = interpolatedD;

          return interpolatedD;
        });
    },
    [props.d, skip],
  );

  React.useLayoutEffect(() => {
    const element = elementRef.current;

    if (element) {
      animate(element);
    }
  }, [animate]);

  const setRef = React.useCallback(
    (element: SVGPathElement | null) => {
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
        interrupt(lastElement, TRANSITION_NAME);
      }

      animate(element);

      elementRef.current = element;
    },
    [animate],
  );

  return setRef;
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
