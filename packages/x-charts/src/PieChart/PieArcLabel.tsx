'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { useAnimatePieArcLabel } from '../hooks/animation/useAnimatePieArcLabel';
import { type SeriesId } from '../models';
import { type PieClasses, pieClasses, useUtilityClasses } from './pieClasses';

interface PieArcLabelOwnerState {
  seriesId: SeriesId;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  skipAnimation: boolean;
  classes?: Partial<PieClasses>;
}

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
  transitionDuration: `${ANIMATION_DURATION_MS}ms`,
  transitionProperty: 'opacity',
  transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
  [`&.${pieClasses.animate}`]: {
    animationDuration: `${ANIMATION_DURATION_MS}ms`,
  },
  '@keyframes animate-opacity': {
    from: { opacity: 0 },
  },
}));

export type PieArcLabelProps = PieArcLabelOwnerState &
  Omit<React.SVGProps<SVGTextElement>, 'ref' | 'color'> & {
    startAngle: number;
    endAngle: number;
    arcLabelRadius: number;
    cornerRadius: number;
    paddingAngle: number;
    skipAnimation: boolean;
    formattedArcLabel?: string | null;
    hidden?: boolean;
  };

const PieArcLabel = React.forwardRef<SVGTextElement, PieArcLabelProps>(
  function PieArcLabel(props, ref) {
    const {
      seriesId,
      classes: innerClasses,
      color,
      startAngle,
      endAngle,
      paddingAngle,
      arcLabelRadius,
      cornerRadius,
      formattedArcLabel,
      isHighlighted,
      isFaded,
      skipAnimation,
      hidden,
      className,
      ...other
    } = props;

    const ownerState = {
      seriesId,
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
      arcLabelRadius,
      paddingAngle,
      skipAnimation,
      ref,
    });

    return (
      <PieArcLabelRoot
        className={clsx(classes.arcLabel, className)}
        data-highlighted={isHighlighted || undefined}
        data-faded={isFaded || undefined}
        {...other}
        {...animatedProps}
        opacity={hidden ? 0 : 1}
      >
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
  hidden: PropTypes.bool,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  paddingAngle: PropTypes.number.isRequired,
  seriesId: PropTypes.string.isRequired,
  skipAnimation: PropTypes.bool.isRequired,
  startAngle: PropTypes.number.isRequired,
} as any;

export { PieArcLabel };
