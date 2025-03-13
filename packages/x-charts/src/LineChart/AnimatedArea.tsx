'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { interrupt, Transition } from '@mui/x-charts-vendor/d3-transition';
import { interpolateString } from '@mui/x-charts-vendor/d3-interpolate';
import { select } from '@mui/x-charts-vendor/d3-selection';
import { easeLinear } from '@mui/x-charts-vendor/d3-ease';
import useForkRef from '@mui/utils/useForkRef';
import { AppearingMask } from './AppearingMask';
import type { AreaElementOwnerState } from './AreaElement';

export interface AnimatedAreaProps extends React.ComponentPropsWithoutRef<'path'> {
  ownerState: AreaElementOwnerState;
  d: string;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
}

const DURATION = 200;
function useAnimateAreaPath(props: Pick<AnimatedAreaProps, 'd' | 'skipAnimation'>) {
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
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/animated-area/)
 */
const AnimatedArea = React.forwardRef<SVGPathElement, AnimatedAreaProps>(
  function AnimatedArea(props, ref) {
    const { d, skipAnimation, ownerState, ...other } = props;

    const animateRef = useAnimateAreaPath(props);
    const forkRef = useForkRef(ref, animateRef);

    return (
      <AppearingMask skipAnimation={skipAnimation} id={`${ownerState.id}-area-clip`}>
        <path
          ref={forkRef}
          d={d}
          fill={ownerState.gradientId ? `url(#${ownerState.gradientId})` : ownerState.color}
          filter={
            // eslint-disable-next-line no-nested-ternary
            ownerState.isHighlighted
              ? 'brightness(140%)'
              : ownerState.gradientId
                ? undefined
                : 'brightness(120%)'
          }
          opacity={ownerState.isFaded ? 0.3 : 1}
          stroke="none"
          {...other}
        />
      </AppearingMask>
    );
  },
);

AnimatedArea.propTypes = {
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

export { AnimatedArea };
