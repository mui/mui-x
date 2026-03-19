'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled, useTheme } from '@mui/material/styles';
import { useAnimatePieArc } from '../hooks';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { type PieArcOwnerState, useUtilityClasses as usePieUtilityClasses } from './pieClasses';

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
    cornerRadius: number;
    endAngle: number;
    innerRadius: number;
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    outerRadius: number;
    paddingAngle: number;
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

  const interactionProps = useInteractionItemProps(
    { type: 'pie', seriesId, dataIndex },
    skipInteraction,
  );
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

PieArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  cornerRadius: PropTypes.number.isRequired,
  dataIndex: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isFocused: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  outerRadius: PropTypes.number.isRequired,
  paddingAngle: PropTypes.number.isRequired,
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
  startAngle: PropTypes.number.isRequired,
} as any;

export { PieArc };
