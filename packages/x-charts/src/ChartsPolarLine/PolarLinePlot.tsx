'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import {
  LineElement,
  type LineElementProps,
  type LineElementSlotProps,
  type LineElementSlots,
} from '../LineChart/LineElement';
import { type LineItemIdentifier } from '../models/seriesType/line';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { usePolarLinePlotData } from './usePolarLinePlotData';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';
import { lineClasses, useUtilityClasses } from '../LineChart/lineClasses';

export interface PolarLinePlotSlots extends LineElementSlots {}

export interface PolarLinePlotSlotProps extends LineElementSlotProps {}

export interface PolarLinePlotProps
  extends
    React.SVGAttributes<SVGSVGElement>,
    Pick<LineElementProps, 'slots' | 'slotProps' | 'skipAnimation'> {
  /**
   * Callback fired when a line item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    lineItemIdentifier: LineItemIdentifier,
  ) => void;
}

const PolarLinePlotRoot = styled('g', {
  name: 'MuiPolarLinePlot',
  slot: 'Root',
})({
  [`& .${lineClasses.line}`]: {
    transitionProperty: 'opacity, fill',
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
    transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
  },
});

/**
 * Renders line series in polar coordinates.
 *
 * Demos:
 *
 * - [Polar Charts](https://mui.com/x/react-charts/polar/)
 *
 * API:
 *
 * - [PolarLinePlot API](https://mui.com/x/api/charts/polar-line-plot/)
 */
function PolarLinePlot(props: PolarLinePlotProps) {
  const {
    slots,
    slotProps,
    skipAnimation: inSkipAnimation,
    onItemClick,
    className,
    ...other
  } = props;
  const skipAnimation = useSkipAnimation(inSkipAnimation);

  const completedData = usePolarLinePlotData();
  const classes = useUtilityClasses();

  return (
    <PolarLinePlotRoot className={clsx(classes.linePlot, className)} {...other}>
      {completedData.map(({ d, seriesId, color, hidden }) => {
        return (
          <LineElement
            key={seriesId}
            seriesId={seriesId}
            d={d}
            color={color}
            hidden={hidden}
            skipAnimation={skipAnimation}
            slots={slots}
            slotProps={slotProps}
            onClick={onItemClick && ((event) => onItemClick(event, { type: 'line', seriesId }))}
          />
        );
      })}
    </PolarLinePlotRoot>
  );
}

PolarLinePlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation: PropTypes.bool,
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
} as any;

export { PolarLinePlot };
