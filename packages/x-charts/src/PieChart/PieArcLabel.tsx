'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { useAnimatePieArcLabel } from '../hooks/animation/useAnimatePieArcLabel';
import { PieItemId } from '../models/seriesType/pie';

export interface PieArcLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
  /** Styles applied to the root element when animation is not skipped. */
  animate: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${pieArcLabelClasses.series}-${seriesId}`.
   */
  series: string;
}

export type PieArcLabelClassKey = keyof PieArcLabelClasses;

interface PieArcLabelOwnerState {
  id: PieItemId;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  skipAnimation: boolean;
  classes?: Partial<PieArcLabelClasses>;
}

export function getPieArcLabelUtilityClass(slot: string) {
  return generateUtilityClass('MuiPieArcLabel', slot);
}

export const pieArcLabelClasses: PieArcLabelClasses = generateUtilityClasses('MuiPieArcLabel', [
  'root',
  'highlighted',
  'faded',
  'animate',
  'series',
]);

const useUtilityClasses = (ownerState: PieArcLabelOwnerState) => {
  const { classes, id, isFaded, isHighlighted, skipAnimation } = ownerState;
  const slots = {
    root: [
      'root',
      `series-${id}`,
      isHighlighted && 'highlighted',
      isFaded && 'faded',
      !skipAnimation && 'animate',
    ],
  };

  return composeClasses(slots, getPieArcLabelUtilityClass, classes);
};

const PieArcLabelRoot = styled('text', {
  name: 'MuiPieArcLabel',
  slot: 'Root',
})(({ theme }) => ({
  fill: (theme.vars || theme).palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
  pointerEvents: 'none',
  animationName: 'animate-opacity',
  animationDuration: '0s',
  animationTimingFunction: ANIMATION_TIMING_FUNCTION,
  [`&.${pieArcLabelClasses.animate}`]: {
    '@media not print': {
      animationDuration: `${ANIMATION_DURATION_MS}ms`,
    },
  },
  '@keyframes animate-opacity': {
    from: { opacity: 0 },
  },
}));

export type PieArcLabelProps = PieArcLabelOwnerState &
  Omit<React.SVGProps<SVGTextElement>, 'ref' | 'color' | 'id'> & {
    startAngle: number;
    endAngle: number;
    innerRadius: number;
    outerRadius: number;
    arcLabelRadius: number;
    cornerRadius: number;
    paddingAngle: number;
    skipAnimation: boolean;
    formattedArcLabel?: string | null;
  };

const PieArcLabel = React.forwardRef<SVGTextElement, PieArcLabelProps>(
  function PieArcLabel(props, ref) {
    const {
      id,
      classes: innerClasses,
      color,
      startAngle,
      endAngle,
      paddingAngle,
      arcLabelRadius,
      innerRadius,
      outerRadius,
      cornerRadius,
      formattedArcLabel,
      isHighlighted,
      isFaded,
      style,
      skipAnimation,
      ...other
    } = props;

    const ownerState = {
      id,
      classes: innerClasses,
      color,
      isFaded,
      isHighlighted,
      skipAnimation,
    };
    const classes = useUtilityClasses(ownerState);

    const animatedProps = useAnimatePieArcLabel({
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
      <PieArcLabelRoot className={classes.root} {...other} {...animatedProps}>
        {formattedArcLabel}
      </PieArcLabelRoot>
    );
  },
);

PieArcLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  arcLabelRadius: PropTypes.number.isRequired,
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  cornerRadius: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  formattedArcLabel: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  innerRadius: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  outerRadius: PropTypes.number.isRequired,
  paddingAngle: PropTypes.number.isRequired,
  skipAnimation: PropTypes.bool.isRequired,
  startAngle: PropTypes.number.isRequired,
} as any;

export { PieArcLabel };
