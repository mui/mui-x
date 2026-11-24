'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { useAnimatePieArcLabel } from '../hooks/animation/useAnimatePieArcLabel';
import type { SeriesId } from '../models';
import { pieClasses, useUtilityClasses } from './pieClasses';
import type { PieClasses } from './pieClasses';

interface PieArcLabelOwnerState {
  /**
   * The id of the series the element belongs to.
   */
  seriesId: SeriesId;
  /**
   * The color of the element.
   */
  color: string;
  /**
   * If `true`, the element is faded.
   */
  isFaded: boolean;
  /**
   * If `true`, the element is highlighted.
   */
  isHighlighted: boolean;
  /**
   * If `true`, animations are skipped.
   */
  skipAnimation: boolean;
  /**
   * Override or extend the styles applied to the component.
   */
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
    /**
     * The start angle (deg).
     */
    startAngle: number;
    /**
     * The end angle (deg).
     */
    endAngle: number;
    /**
     * The radius between circle center and the arc label in px.
     */
    arcLabelRadius: number;
    /**
     * The radius applied to arc corners (similar to border radius).
     */
    cornerRadius: number;
    /**
     * The padding angle (deg) between two arcs.
     */
    paddingAngle: number;
    /**
     * If `true`, animations are skipped.
     */
    skipAnimation: boolean;
    /**
     * The text of the arc label.
     */
    formattedArcLabel?: string | null;
    /**
     * If `true`, the element is hidden.
     */
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

PieArcLabel.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The radius between circle center and the arc label in px.
   */
  arcLabelRadius: PropTypes.number.isRequired,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The color of the element.
   */
  color: PropTypes.string.isRequired,
  /**
   * The radius applied to arc corners (similar to border radius).
   */
  cornerRadius: PropTypes.number.isRequired,
  /**
   * The end angle (deg).
   */
  endAngle: PropTypes.number.isRequired,
  /**
   * The text of the arc label.
   */
  formattedArcLabel: PropTypes.string,
  /**
   * If `true`, the element is hidden.
   */
  hidden: PropTypes.bool,
  /**
   * If `true`, the element is faded.
   */
  isFaded: PropTypes.bool.isRequired,
  /**
   * If `true`, the element is highlighted.
   */
  isHighlighted: PropTypes.bool.isRequired,
  /**
   * The padding angle (deg) between two arcs.
   */
  paddingAngle: PropTypes.number.isRequired,
  /**
   * The id of the series the element belongs to.
   */
  seriesId: PropTypes.string.isRequired,
  /**
   * If `true`, animations are skipped.
   */
  skipAnimation: PropTypes.bool.isRequired,
  /**
   * The start angle (deg).
   */
  startAngle: PropTypes.number.isRequired,
} as any;

export { PieArcLabel };
