'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useTheme } from '@mui/material/styles';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { markElementClasses, MarkElementOwnerState, useUtilityClasses } from './markElementClasses';

export type CircleMarkElementProps = Omit<MarkElementOwnerState, 'isFaded' | 'isHighlighted'> &
  Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> & {
    /**
     * If `true`, animations are skipped.
     * @default false
     */
    skipAnimation?: boolean;
    /**
     * The index to the element in the series' data array.
     */
    dataIndex: number;
    /**
     * If `true`, the marker is faded.
     * @default false
     */
    isFaded?: boolean;
    /**
     * If `true`, the marker is highlighted.
     * @default false
     */
    isHighlighted?: boolean;
  };

const Circle = styled('circle')({
  [`&.${markElementClasses.animate}`]: {
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
    transitionProperty: 'cx, cy',
    transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
  },
});

/**
 * The line mark element that only render circle for performance improvement.
 *
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [CircleMarkElement API](https://mui.com/x/api/charts/circle-mark-element/)
 */
function CircleMarkElement(props: CircleMarkElementProps) {
  const {
    x,
    y,
    id,
    classes: innerClasses,
    color,
    dataIndex,
    onClick,
    skipAnimation,
    isFaded = false,
    isHighlighted = false,
    ...other
  } = props;

  const theme = useTheme();
  const interactionProps = useInteractionItemProps({ type: 'line', seriesId: id, dataIndex });

  const ownerState = {
    id,
    classes: innerClasses,
    isHighlighted,
    isFaded,
    color,
    skipAnimation,
  };
  const classes = useUtilityClasses(ownerState);

  return (
    <Circle
      {...other}
      cx={x}
      cy={y}
      r={5}
      fill={(theme.vars || theme).palette.background.paper}
      stroke={color}
      strokeWidth={2}
      className={classes.root}
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'unset'}
      {...interactionProps}
    />
  );
}

CircleMarkElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  /**
   * The index to the element in the series' data array.
   */
  dataIndex: PropTypes.number.isRequired,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * The shape of the marker.
   */
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye'])
    .isRequired,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
} as any;

export { CircleMarkElement };
