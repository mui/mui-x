'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled, useTheme } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useAnimatePieArc } from '../hooks';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { type SeriesId } from '../models';

export interface PieArcClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${pieArcClasses.series}-${seriesId}`.
   */
  series: string;
  /** Styles applied to the focus indicator element. */
  focusIndicator: string;
}

export type PieArcClassKey = keyof PieArcClasses;

interface PieArcOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  isFocused: boolean;
  stroke?: string;
  classes?: Partial<PieArcClasses>;
}

export function getPieArcUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieArc', slot);
}

export const pieArcClasses: PieArcClasses = generateUtilityClasses('MuiPieArc', [
  'root',
  'highlighted',
  'faded',
  'series',
  'focusIndicator',
]);

const useUtilityClasses = (ownerState: PieArcOwnerState) => {
  const { classes, seriesId, isFaded, isHighlighted, dataIndex } = ownerState;
  const slots = {
    root: [
      'root',
      `series-${seriesId}`,
      `data-index-${dataIndex}`,
      isHighlighted && 'highlighted',
      isFaded && 'faded',
    ],
  };

  return composeClasses(slots, getPieArcUtilityClass, classes);
};

const PieArcRoot = styled('path', {
  name: 'MuiPieArc',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.arc, // FIXME: Inconsistent naming with slot
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
  const classes = useUtilityClasses(ownerState);

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
      className={clsx(classes.root, className)}
      fill={ownerState.color}
      opacity={ownerState.isFaded ? 0.3 : 1}
      filter={ownerState.isHighlighted ? 'brightness(120%)' : 'none'}
      stroke={stroke}
      strokeWidth={1}
      strokeLinejoin="round"
      data-highlighted={ownerState.isHighlighted || undefined}
      data-faded={ownerState.isFaded || undefined}
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
