'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { barElementClasses } from './barElementClasses';
import { BarElement, type BarElementSlotProps, type BarElementSlots } from './BarElement';
import { type BarItemIdentifier } from '../models';
import { useDrawingArea, useXAxes, useYAxes } from '../hooks';
import { BarClipPath } from './BarClipPath';
import { type BarLabelSlotProps, type BarLabelSlots } from './BarLabel/BarLabelItem';
import { BarLabelPlot } from './BarLabel/BarLabelPlot';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { useBarPlotData } from './useBarPlotData';
import { useUtilityClasses } from './barClasses';
import type { BarItem, BarLabelContext } from './BarLabel';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from '../internals/animation/animation';

export interface BarPlotSlots extends BarElementSlots, BarLabelSlots {}

export interface BarPlotSlotProps extends BarElementSlotProps, BarLabelSlotProps {}

export interface BarPlotProps {
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
   * @deprecated Use `barLabel` in the chart series instead.
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel?: 'value' | ((item: BarItem, context: BarLabelContext) => string | null | undefined);
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BarPlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarPlotSlots;
}

const BarPlotRoot = styled('g', {
  name: 'MuiBarPlot',
  slot: 'Root',
})({
  [`& .${barElementClasses.root}`]: {
    transitionProperty: 'opacity, fill',
    transitionDuration: `${ANIMATION_DURATION_MS}ms`,
    transitionTimingFunction: ANIMATION_TIMING_FUNCTION,
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
function BarPlot(props: BarPlotProps) {
  const { skipAnimation: inSkipAnimation, onItemClick, borderRadius, barLabel, ...other } = props;

  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);
  const { xAxis: xAxes } = useXAxes();
  const { yAxis: yAxes } = useYAxes();
  const { completedData, masksData } = useBarPlotData(useDrawingArea(), xAxes, yAxes);

  const withoutBorderRadius = !borderRadius || borderRadius <= 0;
  const classes = useUtilityClasses();

  return (
    <BarPlotRoot className={classes.root}>
      {!withoutBorderRadius &&
        masksData.map(
          ({ id, x, y, xOrigin, yOrigin, width, height, hasPositive, hasNegative, layout }) => {
            return (
              <BarClipPath
                key={id}
                maskId={id}
                borderRadius={borderRadius}
                hasNegative={hasNegative}
                hasPositive={hasPositive}
                layout={layout}
                x={x}
                y={y}
                xOrigin={xOrigin}
                yOrigin={yOrigin}
                width={width}
                height={height}
                skipAnimation={skipAnimation ?? false}
              />
            );
          },
        )}
      {completedData.map(({ seriesId, layout, xOrigin, yOrigin, data }) => {
        return (
          <g key={seriesId} data-series={seriesId} className={classes.series}>
            {data.map(({ dataIndex, color, maskId, x, y, width, height }) => {
              const barElement = (
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
              );

              if (withoutBorderRadius) {
                return barElement;
              }

              return (
                <g key={dataIndex} clipPath={`url(#${maskId})`}>
                  {barElement}
                </g>
              );
            })}
          </g>
        );
      })}
      {completedData.map((processedSeries) => (
        <BarLabelPlot
          key={processedSeries.seriesId}
          className={classes.seriesLabels}
          processedSeries={processedSeries}
          skipAnimation={skipAnimation}
          barLabel={barLabel}
          {...other}
        />
      ))}
    </BarPlotRoot>
  );
}

BarPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel: PropTypes.oneOfType([PropTypes.oneOf(['value']), PropTypes.func]),
  /**
   * The placement of the bar label.
   * It controls whether the label is rendered inside or outside the bar.
   */
  barLabelPlacement: PropTypes.oneOf(['outside', 'inside']),
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

export { BarPlot };
