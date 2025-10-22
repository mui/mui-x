'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { barElementClasses } from './barElementClasses';
import { BarElement, BarElementSlotProps, BarElementSlots } from './BarElement';
import { BarItemIdentifier } from '../models';
import { useDrawingArea, useXAxes, useYAxes } from '../hooks';
import { BarLabelItemProps, BarLabelSlotProps, BarLabelSlots } from './BarLabel/BarLabelItem';
import { BarLabelPlot } from './BarLabel/BarLabelPlot';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { useUtilityClasses } from './barClasses';
import { useBarRangePlotData } from './useBarRangePlotData';
import { BarRangeValueType } from '../models/seriesType/barRange';

export interface BarRangePlotSlots extends BarElementSlots, BarLabelSlots {}

export interface BarRangePlotSlotProps extends BarElementSlotProps, BarLabelSlotProps {}

export interface BarRangePlotProps extends Pick<BarLabelItemProps<BarRangeValueType>, 'barLabel'> {
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
  slotProps?: BarRangePlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarRangePlotSlots;
}

const BarRangePlotRoot = styled('g', {
  name: 'MuiBarRangePlot',
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
 * - [BarRangePlot API](https://mui.com/x/api/charts/bar-range-plot/)
 */
function BarRangePlot(props: BarRangePlotProps) {
  const { skipAnimation: inSkipAnimation, onItemClick, borderRadius, barLabel, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();
  const completedData = useBarRangePlotData(useDrawingArea(), xAxes, yAxes);

  const classes = useUtilityClasses();

  return (
    <BarRangePlotRoot className={classes.root}>
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
        <BarLabelPlot<BarRangeValueType | null>
          key={processedSeries.seriesId}
          processedSeries={processedSeries}
          skipAnimation={skipAnimation}
          {...other}
        />
      ))}
    </BarRangePlotRoot>
  );
}

export { BarRangePlot };
