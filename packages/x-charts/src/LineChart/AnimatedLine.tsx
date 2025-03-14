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

const DURATION = 200;
function useAnimatePath(props: Pick<AnimatedLineProps, 'd' | 'skipAnimation'>) {
  const lastDRef = React.useRef(props.d);
  const transitionRef = React.useRef<Transition<SVGPathElement, unknown, null, undefined>>(null);
  const [path, setPath] = React.useState<SVGPathElement | null>(null);
  React.useLayoutEffect(() => {
    /* If we're not skipping animation, we need to set the attribute to override React's changes.
     * Still need to figure out if this is better than asking the user not to pass the `d` prop to the component.
     * The problem with that is that SSR might not look good. */
    if (!props.skipAnimation) {
      path?.setAttribute('d', lastDRef.current);
    }
  }, [path, props.skipAnimation]);

  React.useLayoutEffect(() => {
    // TODO: What if we set skipAnimation to true in the middle of the animation?
    if (path === null || props.skipAnimation) {
      return undefined;
    }

    const lastD = lastDRef.current;
    const stringInterpolator = interpolateString(lastD, props.d);

    transitionRef.current = select(path)
      .transition()
      .duration(DURATION)
      .ease(easeLinear)
      .attrTween('d', () => (t) => {
        const interpolatedD = stringInterpolator(t);

        lastDRef.current = interpolatedD;

        return interpolatedD;
      });

    return () => interrupt(path);
  }, [path, props.d, props.skipAnimation]);

  return setPath;
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

    const animateRef = useAnimatePath(props);
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
