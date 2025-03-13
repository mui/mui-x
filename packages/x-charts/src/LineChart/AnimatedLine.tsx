'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { select } from '@mui/x-charts-vendor/d3-selection';
import { interrupt, Transition } from '@mui/x-charts-vendor/d3-transition';
import { useRef } from 'react';
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

const DURATION = 200;
function useLineAnimatedProps(props: Pick<AnimatedLineProps, 'd' | 'skipAnimation'>) {
  const lastValues = React.useRef({ d: props.d });
  const transitionRef = React.useRef<Transition<SVGPathElement, unknown, null, undefined>>(null);
  const lastPath = useRef<SVGPathElement>(null);

  // TODO: What if we set skipAnimation to true in the middle of the animation?
  const animate: React.RefCallback<SVGPathElement> = React.useCallback(
    (path) => {
      if (path === null || props.skipAnimation) {
        const lastPathElement = lastPath.current;

        if (lastPathElement) {
          interrupt(lastPathElement);
        }

        return;
      }

      lastPath.current = path;
      const lastD = lastValues.current.d;
      const stringInterpolator = interpolateString(lastD, props.d);

      transitionRef.current = select(path)
        .transition()
        .duration(DURATION)
        .attrTween('d', () => (t) => {
          const interpolatedD = stringInterpolator(t);

          lastValues.current = { d: interpolatedD };

          return interpolatedD;
        });
    },
    [props.d, props.skipAnimation],
  );

  return animate;
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

    const animateRef = useLineAnimatedProps(props);

    return (
      <AppearingMask skipAnimation={skipAnimation} id={`${ownerState.id}-line-clip`}>
        <path
          ref={(newRef) => {
            if (typeof ref === 'function') {
              ref?.(newRef);
            }

            animateRef(newRef);
          }}
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
