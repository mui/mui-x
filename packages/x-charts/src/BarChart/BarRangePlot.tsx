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

export interface BarRangePlotSlots extends BarElementSlots, BarLabelSlots {}

export interface BarRangePlotSlotProps extends BarElementSlotProps, BarLabelSlotProps {}

export interface BarRangePlotProps extends Pick<BarLabelItemProps, 'barLabel'> {
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

const BarPlotRoot = styled('g', {
  name: 'MuiBarPlot',
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
 * - [Stacking](https://mui.com/x/react-charts/stacking/)
 *
 * API:
 *
 * - [BarPlot API](https://mui.com/x/api/charts/bar-plot/)
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
    <BarPlotRoot className={classes.root}>
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
      {barLabel && (
        <BarLabelPlot
          bars={completedData}
          skipAnimation={skipAnimation}
          barLabel={barLabel}
          {...other}
        />
      )}
    </BarPlotRoot>
  );
}

export { BarRangePlot };
