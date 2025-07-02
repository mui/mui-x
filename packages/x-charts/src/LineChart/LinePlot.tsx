'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import {
  LineElement,
  lineElementClasses,
  LineElementProps,
  LineElementSlotProps,
  LineElementSlots,
} from './LineElement';
import { LineItemIdentifier } from '../models/seriesType/line';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useXAxes, useYAxes } from '../hooks';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { useLinePlotData } from './useLinePlotData';

export interface LinePlotSlots extends LineElementSlots {}

export interface LinePlotSlotProps extends LineElementSlotProps {}

export interface LinePlotProps
  extends React.SVGAttributes<SVGSVGElement>,
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
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
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
    <LinePlotRoot data-drawing-container {...other}>
      {completedData.map(({ d, seriesId, color, gradientId }) => {
        return (
          <LineElement
            key={seriesId}
            id={seriesId}
            d={d}
            color={color}
            gradientId={gradientId}
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
