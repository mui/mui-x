'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { barElementClasses } from './barElementClasses';
import { BarElement, BarElementSlotProps, BarElementSlots } from './BarElement';
import { BarItemIdentifier } from '../models';
import { useDrawingArea, useXAxes, useYAxes } from '../hooks';
import { BarLabelSlotProps, BarLabelSlots } from './BarLabel/BarLabelItem';
import { BarLabelPlot } from './BarLabel/BarLabelPlot';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { useUtilityClasses } from './barClasses';
import { useRangeBarPlotData } from './useRangeBarPlotData';
import { RangeBarValueType } from '../models/seriesType/rangeBar';

export interface RangeBarPlotSlots extends BarElementSlots, BarLabelSlots {}

export interface RangeBarPlotSlotProps extends BarElementSlotProps, BarLabelSlotProps {}

export interface RangeBarPlotProps {
  /**
   * If `true`, animations are skipped.
   * @default undefined
   */
  skipAnimation?: boolean;
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
   */
  onItemClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    barItemIdentifier: BarItemIdentifier,
  ) => void;
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius?: number;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: RangeBarPlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: RangeBarPlotSlots;
}

const RangeBarPlotRoot = styled('g', {
  name: 'MuiRangeBarPlot',
  slot: 'Root',
})({
  [`& .${barElementClasses.root}`]: {
    transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  },
});

/**
 * Demos:
 *
 * - [Bars](https://mui.com/x/react-charts/bars/)
 * - [Bar demonstration](https://mui.com/x/react-charts/bar-demo/)
 *
 * API:
 *
 * - [RangeBarPlot API](https://mui.com/x/api/charts/range-bar-plot/)
 */
function RangeBarPlot(props: RangeBarPlotProps): React.JSX.Element {
  const { skipAnimation: inSkipAnimation, onItemClick, borderRadius, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();
  const completedData = useRangeBarPlotData(useDrawingArea(), xAxes, yAxes);

  const classes = useUtilityClasses();

  return (
    <RangeBarPlotRoot className={classes.root}>
      {completedData.map(({ seriesId, data }) => {
        return (
          <g key={seriesId} data-series={seriesId} className={classes.series}>
            {data.map(({ dataIndex, color, layout, x, xOrigin, y, yOrigin, width, height }) => (
              <BarElement
                key={dataIndex}
                id={seriesId}
                dataIndex={dataIndex}
                color={color}
                skipAnimation={skipAnimation ?? false}
                layout={layout ?? 'vertical'}
                x={x}
                xOrigin={xOrigin}
                y={y}
                yOrigin={yOrigin}
                width={width}
                height={height}
                {...other}
                onClick={
                  onItemClick &&
                  ((event) => {
                    onItemClick(event, { type: 'bar', seriesId, dataIndex });
                  })
                }
              />
            ))}
          </g>
        );
      })}
      {completedData.map((processedSeries) => (
        <BarLabelPlot<RangeBarValueType | null>
          key={processedSeries.seriesId}
          processedSeries={processedSeries}
          skipAnimation={skipAnimation}
          {...other}
        />
      ))}
    </RangeBarPlotRoot>
  );
}

RangeBarPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Defines the border radius of the bar element.
   */
  borderRadius: PropTypes.number,
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
   */
  onItemClick: PropTypes.func,
  /**
   * If `true`, animations are skipped.
   * @default undefined
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

export { RangeBarPlot };
