'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  AreaElement,
  areaElementClasses,
  type AreaElementProps,
  type AreaElementSlotProps,
  type AreaElementSlots,
} from './AreaElement';
import { type LineItemIdentifier } from '../models/seriesType/line';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useXAxes, useYAxes } from '../hooks/useAxis';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { useAreaPlotData } from './useAreaPlotData';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';

export interface AreaPlotSlots extends AreaElementSlots {}

export interface AreaPlotSlotProps extends AreaElementSlotProps {}

export interface AreaPlotProps
  extends
    React.SVGAttributes<SVGSVGElement>,
    Pick<AreaElementProps, 'slots' | 'slotProps' | 'skipAnimation'> {
  /**
   * Callback fired when a line area item is clicked.
   * @param {React.MouseEvent<SVGPathElement, MouseEvent>} event The event source of the callback.
   * @param {LineItemIdentifier} lineItemIdentifier The line item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    lineItemIdentifier: LineItemIdentifier,
  ) => void;
}

const AreaPlotRoot = styled('g', {
  name: 'MuiAreaPlot',
  slot: 'Root',
})({
  [`& .${areaElementClasses.root}`]: {
    transitionProperty: 'opacity, fill',
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
    transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
  },
});

const useAggregatedData = () => {
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();

  return useAreaPlotData(xAxes, yAxes);
};

/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [AreaPlot API](https://mui.com/x/api/charts/area-plot/)
 */
function AreaPlot(props: AreaPlotProps) {
  const { slots, slotProps, onItemClick, skipAnimation: inSkipAnimation, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);

  const completedData = useAggregatedData();

  return (
    <AreaPlotRoot {...other}>
      {completedData.map(
        ({ d, seriesId, color, area, gradientId }) =>
          !!area && (
            <AreaElement
              key={seriesId}
              seriesId={seriesId}
              d={d}
              color={color}
              gradientId={gradientId}
              slots={slots}
              slotProps={slotProps}
              onClick={onItemClick && ((event) => onItemClick(event, { type: 'line', seriesId }))}
              skipAnimation={skipAnimation}
            />
          ),
      )}
    </AreaPlotRoot>
  );
}

AreaPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a line area item is clicked.
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

export { AreaPlot };
