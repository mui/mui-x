'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useTheme } from '@mui/material/styles';
import { useAnimatePieArc } from '../hooks';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { useUtilityClasses as usePieUtilityClasses } from './pieClasses';
import type { PieArcOwnerState } from './pieClasses';

const PieArcRoot = styled('path', {
  name: 'MuiPieArc',
  slot: 'Root',
})<{ ownerState: PieArcOwnerState }>({
  transitionProperty: 'opacity, fill, filter',
  transitionDuration: `${ANIMATION_DURATION_MS}ms`,
  transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
});

export type PieArcProps = Omit<React.SVGProps<SVGPathElement>, 'ref'> &
  PieArcOwnerState & {
    /**
     * The radius applied to arc corners (similar to border radius).
     */
    cornerRadius: number;
    /**
     * The end angle (deg).
     */
    endAngle: number;
    /**
     * The radius between circle center and the beginning of the arc.
     */
    innerRadius: number;
    /**
     * Callback fired when the arc is clicked.
     * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
     */
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    /**
     * The radius between circle center and the end of the arc.
     */
    outerRadius: number;
    /**
     * The padding angle (deg) between two arcs.
     */
    paddingAngle: number;
    /**
     * The start angle (deg).
     */
    startAngle: number;
    /**
     * If `true`, the animation is disabled.
     */
    skipAnimation?: boolean;
    /**
     * If `true`, the default event handlers are disabled.
     * Those are used, for example, to display a tooltip or highlight the arc on hover.
     */
    skipInteraction?: boolean;
  };

const PieArc = React.forwardRef<SVGPathElement, PieArcProps>(function PieArc(props, ref) {
  const {
    className,
    classes: innerClasses,
    color,
    dataIndex,
    seriesId,
    isFaded,
    isHighlighted,
    isFocused,
    onClick,
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    paddingAngle,
    skipAnimation,
    stroke: strokeProp,
    skipInteraction,
    ...other
  } = props;

  const theme = useTheme();
  const stroke = strokeProp ?? (theme.vars || theme).palette.background.paper;

  const ownerState = {
    seriesId,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    isFocused,
  };
  const classes = usePieUtilityClasses(ownerState);

  const interactionProps = useInteractionItemProps({ type: 'pie', seriesId, dataIndex });
  const animatedProps = useAnimatePieArc({
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    paddingAngle,
    skipAnimation,
    ref,
  });

  return (
    <PieArcRoot
      onClick={onClick}
      cursor={onClick ? 'pointer' : 'unset'}
      ownerState={ownerState}
      className={clsx(classes.arc, className)}
      fill={color}
      opacity={isFaded ? 0.3 : 1}
      filter={isHighlighted ? 'brightness(120%)' : 'none'}
      stroke={stroke}
      strokeWidth={1}
      strokeLinejoin="round"
      data-highlighted={isHighlighted || undefined}
      data-faded={isFaded || undefined}
      data-index={dataIndex}
      {...other}
      {...interactionProps}
      {...animatedProps}
    />
  );
});

PieArc.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The radius applied to arc corners (similar to border radius).
   */
  cornerRadius: PropTypes.number.isRequired,
  /**
   * The index of the data point in the series.
   */
  dataIndex: PropTypes.number.isRequired,
  /**
   * The end angle (deg).
   */
  endAngle: PropTypes.number.isRequired,
  /**
   * The radius between circle center and the beginning of the arc.
   */
  innerRadius: PropTypes.number.isRequired,
  /**
   * If `true`, the element is faded.
   */
  isFaded: PropTypes.bool.isRequired,
  /**
   * If `true`, the element has keyboard focus.
   */
  isFocused: PropTypes.bool.isRequired,
  /**
   * If `true`, the element is highlighted.
   */
  isHighlighted: PropTypes.bool.isRequired,
  /**
   * The radius between circle center and the end of the arc.
   */
  outerRadius: PropTypes.number.isRequired,
  /**
   * The padding angle (deg) between two arcs.
   */
  paddingAngle: PropTypes.number.isRequired,
  /**
   * The id of the series the element belongs to.
   */
  seriesId: PropTypes.string.isRequired,
  /**
   * If `true`, the animation is disabled.
   */
  skipAnimation: PropTypes.bool,
  /**
   * If `true`, the default event handlers are disabled.
   * Those are used, for example, to display a tooltip or highlight the arc on hover.
   */
  skipInteraction: PropTypes.bool,
  /**
   * The start angle (deg).
   */
  startAngle: PropTypes.number.isRequired,
} as any;

export { PieArc };
