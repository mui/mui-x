'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  LineElement,
  lineElementClasses,
  type LineElementProps,
  type LineElementSlotProps,
  type LineElementSlots,
} from './LineElement';
import { type LineItemIdentifier } from '../models/seriesType/line';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useXAxes, useYAxes } from '../hooks';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { useLinePlotData } from './useLinePlotData';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';

export interface LinePlotSlots extends LineElementSlots {}

export interface LinePlotSlotProps extends LineElementSlotProps {}

export interface LinePlotProps
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

const LinePlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})({
  [`& .${lineElementClasses.root}`]: {
    transitionProperty: 'opacity, fill',
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
    transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
  },
});

const useAggregatedData = () => {
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();

  return useLinePlotData(xAxes, yAxes);
};

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LinePlot API](https://mui.com/x/api/charts/line-plot/)
 */
function LinePlot(props: LinePlotProps) {
  const { slots, slotProps, skipAnimation: inSkipAnimation, onItemClick, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);

  const completedData = useAggregatedData();
  return (
    <LinePlotRoot {...other}>
      {completedData.map(({ d, seriesId, color, gradientId, hidden }) => {
        return (
          <LineElement
            key={seriesId}
            seriesId={seriesId}
            d={d}
            color={color}
            gradientId={gradientId}
            hidden={hidden}
            skipAnimation={skipAnimation}
            slots={slots}
            slotProps={slotProps}
            onClick={onItemClick && ((event) => onItemClick(event, { type: 'line', seriesId }))}
          />
        );
      })}
    </LinePlotRoot>
  );
}

LinePlot.propTypes = {
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

export { LinePlot };
