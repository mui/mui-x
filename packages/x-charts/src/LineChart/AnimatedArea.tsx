'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useAnimateArea } from '../hooks/animation/useAnimateArea';
import type { AreaElementOwnerState } from './AreaElement';
import { AppearingMask } from './AppearingMask';

export interface AnimatedAreaProps extends React.ComponentPropsWithoutRef<'path'> {
  ownerState: AreaElementOwnerState;
  d: string;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
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
function AnimatedArea(props: AnimatedAreaProps) {
  const { skipAnimation, ownerState, ...other } = props;
  const animatedProps = useAnimateArea(props);

  return (
    <AppearingMask skipAnimation={skipAnimation} id={`${ownerState.id}-area-clip`}>
      <path
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
        {...animatedProps}
      />
    </AppearingMask>
  );
}

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
