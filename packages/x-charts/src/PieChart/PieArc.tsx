'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { useAnimatePieArc } from '../hooks';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { useInteractionItemProps } from '../hooks/useInteractionItemProps';
import { PieItemId } from '../models';

export interface PieArcClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
}

export type PieArcClassKey = keyof PieArcClasses;

interface PieArcOwnerState {
  id: PieItemId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<PieArcClasses>;
}

export function getPieArcUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieArc', slot);
}

export const pieArcClasses: PieArcClasses = generateUtilityClasses('MuiPieArc', [
  'root',
  'highlighted',
  'faded',
]);

const useUtilityClasses = (ownerState: PieArcOwnerState) => {
  const { classes, id, isFaded, isHighlighted, dataIndex } = ownerState;
  const slots = {
    root: [
      'root',
      `series-${id}`,
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
  overridesResolver: (_, styles) => styles.arc,
})<{ ownerState: PieArcOwnerState }>(({ theme }) => ({
  // Got to move stroke to an element prop instead of style.
  stroke: (theme.vars || theme).palette.background.paper,
  transitionProperty: 'opacity, fill, filter',
  transitionDuration: `${ANIMATION_DURATION_MS}ms`,
  transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
}));

export type PieArcProps = Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> &
  PieArcOwnerState & {
    cornerRadius: number;
    endAngle: number;
    innerRadius: number;
    onClick?: (event: React.MouseEvent<SVGPathElement, MouseEvent>) => void;
    outerRadius: number;
    paddingAngle: number;
    startAngle: number;
    /** @default false */
    skipAnimation: boolean;
  };

const PieArc = React.forwardRef<SVGPathElement, PieArcProps>(function PieArc(props, ref) {
  const {
    classes: innerClasses,
    color,
    dataIndex,
    id,
    isFaded,
    isHighlighted,
    onClick,
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius,
    outerRadius,
    paddingAngle,
    skipAnimation,
    ...other
  } = props;

  const ownerState = {
    id,
    dataIndex,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
  };
  const classes = useUtilityClasses(ownerState);

  const interactionProps = useInteractionItemProps({ type: 'pie', seriesId: id, dataIndex });
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
      className={classes.root}
      fill={ownerState.color}
      opacity={ownerState.isFaded ? 0.3 : 1}
      filter={ownerState.isHighlighted ? 'brightness(120%)' : 'none'}
      strokeWidth={1}
      strokeLinejoin="round"
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
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  innerRadius: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  outerRadius: PropTypes.number.isRequired,
  paddingAngle: PropTypes.number.isRequired,
  /**
   * @default false
   */
  skipAnimation: PropTypes.bool.isRequired,
  startAngle: PropTypes.number.isRequired,
} as any;

export { PieArc };
