'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { select } from '@mui/x-charts-vendor/d3-selection';
import { easeLinear } from '@mui/x-charts-vendor/d3-ease';
import { interrupt, Transition } from '@mui/x-charts-vendor/d3-transition';
import useForkRef from '@mui/utils/useForkRef';
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
const DURATION = 200;
function useAnimatePath(props: Pick<AnimatedLineProps, 'd'>, { skip }: { skip?: boolean }) {
  const lastInterpolatedDRef = React.useRef(props.d);
  const transitionRef = React.useRef<Transition<SVGPathElement, unknown, null, undefined>>(null);

  /*
   * We need to interrupt the animation when:
   * - the element is removed from the DOM
   * - the `skipAnimation` prop becomes true
   * - the `d` prop changes and `skipAnimation` is not true and there is an element
   *
   * We start a new animation when:
   * - a new element is added to the DOM
   * - the `skipAnimation` prop becomes false
   * - the `d` prop changes and `skipAnimation` is not true and there is an element
   *   */

  const elementRef = React.useRef<SVGPathElement>(null);
  const elementUnmounted = React.useRef(false);

  /* Stop the transition if the component that calls this hook is unmounted. */
  React.useLayoutEffect(() => {
    return () => {
      const lastElement = elementRef.current;

      interrupt(lastElement, TRANSITION_NAME);
    };
  }, []);

  /* Handles `skip` changing.
   * If it happens while the element is transitioning, it should jump to the finished state of the transition
   * immediately. */
  React.useLayoutEffect(() => {
    const transition = transitionRef.current;
    const element = elementRef.current;

    if (element && transition) {
      if (skip) {
        interrupt(element, TRANSITION_NAME);
      } else {
        // TODO: start animation
      }
    }
  }, [skip]);

  /* `elementUnmounted` is when to true when a `setRef` is called with a non-null element. This is needed because
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
        .duration(DURATION)
        .ease(easeLinear)
        .attrTween('d', () => (t) => {
          const interpolatedD = stringInterpolator(t);

          lastInterpolatedDRef.current = interpolatedD;

          return interpolatedD;
        });
    },
    [props.d],
  );

  React.useLayoutEffect(() => {
    const element = elementRef.current;

    if (element && !skip) {
      interrupt(element, TRANSITION_NAME);
      // Also, start the animation
      animate(element);
    }
  }, [animate, skip]);

  const setRef = React.useCallback(
    (element: SVGPathElement | null) => {
      elementUnmounted.current = element === null;

      if (element === null) {
        return;
      }

      // If it's the same element, there's nothing to do.
      if (elementRef.current === element) {
        return;
      }

      if (!skip) {
        /* If we're not skipping animation, we need to set the attribute to override React's changes.
         * Still need to figure out if this is better than asking the user not to pass the `d` prop to the component.
         * The problem with that is that SSR might not look good. */
        element.setAttribute('d', lastInterpolatedDRef.current);
        // Also, start the animation
        animate(element);
      }

      elementRef.current = element;
    },
    [animate, skip],
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
