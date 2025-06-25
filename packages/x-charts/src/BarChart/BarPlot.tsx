'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { barElementClasses } from './barElementClasses';
import { BarElement, BarElementSlotProps, BarElementSlots } from './BarElement';
import { ComputedAxis } from '../models/axis';
import { BarItemIdentifier } from '../models';
import getColor from './seriesConfig/getColor';
import { useChartId, useDrawingArea, useXAxes, useYAxes } from '../hooks';
import { ProcessedBarSeriesData, MaskData } from './types';
import { BarClipPath } from './BarClipPath';
import { BarLabelItemProps, BarLabelSlotProps, BarLabelSlots } from './BarLabel/BarLabelItem';
import { BarLabelPlot } from './BarLabel/BarLabelPlot';
import { checkScaleErrors } from './checkScaleErrors';
import { useBarSeriesContext } from '../hooks/useBarSeries';
import { useSkipAnimation } from '../hooks/useSkipAnimation';
import { SeriesProcessorResult } from '../internals/plugins/models/seriesConfig/seriesProcessor.types';
import { useInternalIsZoomInteracting } from '../internals/plugins/featurePlugins/useChartCartesianAxis/useInternalIsZoomInteracting';
import { useUtilityClasses } from './barClasses';

/**
 * Solution of the equations
 * W = barWidth * N + offset * (N-1)
 * offset / (offset + barWidth) = r
 * @param bandWidth The width available to place bars.
 * @param numberOfGroups The number of bars to place in that space.
 * @param gapRatio The ratio of the gap between bars over the bar width.
 * @returns The bar width and the offset between bars.
 */
function getBandSize({
  bandWidth: W,
  numberOfGroups: N,
  gapRatio: r,
}: {
  bandWidth: number;
  numberOfGroups: number;
  gapRatio: number;
}) {
  if (r === 0) {
    return {
      barWidth: W / N,
      offset: 0,
    };
  }
  const barWidth = W / (N + (N - 1) * r);
  const offset = r * barWidth;
  return {
    barWidth,
    offset,
  };
}

export interface BarPlotSlots extends BarElementSlots, BarLabelSlots {}

export interface BarPlotSlotProps extends BarElementSlotProps, BarLabelSlotProps {}

export interface BarPlotProps extends Pick<BarLabelItemProps, 'barLabel'> {
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
  slotProps?: BarPlotSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarPlotSlots;
}

const useAggregatedData = (): {
  completedData: ProcessedBarSeriesData[];
  masksData: MaskData[];
} => {
  const seriesData =
    useBarSeriesContext() ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as SeriesProcessorResult<'bar'>);

  const drawingArea = useDrawingArea();
  const chartId = useChartId();

  const { series, stackingGroups } = seriesData;
  const { xAxis, xAxisIds } = useXAxes();
  const { yAxis, yAxisIds } = useYAxes();
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  const masks: Record<string, MaskData> = {};

  const data = stackingGroups.flatMap(({ ids: seriesIds }, groupIndex) => {
    const xMin = drawingArea.left;
    const xMax = drawingArea.left + drawingArea.width;

    const yMin = drawingArea.top;
    const yMax = drawingArea.top + drawingArea.height;

    return seriesIds.map((seriesId) => {
      const xAxisId = series[seriesId].xAxisId ?? defaultXAxisId;
      const yAxisId = series[seriesId].yAxisId ?? defaultYAxisId;

      const xAxisConfig = xAxis[xAxisId];
      const yAxisConfig = yAxis[yAxisId];

      const verticalLayout = series[seriesId].layout === 'vertical';

      checkScaleErrors(verticalLayout, seriesId, series[seriesId], xAxisId, xAxis, yAxisId, yAxis);

      const baseScaleConfig = (verticalLayout ? xAxisConfig : yAxisConfig) as ComputedAxis<'band'>;

      const xScale = xAxisConfig.scale;
      const yScale = yAxisConfig.scale;

      const colorGetter = getColor(series[seriesId], xAxis[xAxisId], yAxis[yAxisId]);
      const bandWidth = baseScaleConfig.scale.bandwidth();

      const { barWidth, offset } = getBandSize({
        bandWidth,
        numberOfGroups: stackingGroups.length,
        gapRatio: baseScaleConfig.barGapRatio,
      });
      const barOffset = groupIndex * (barWidth + offset);

      const { stackedData, data: currentSeriesData, layout } = series[seriesId];

      const seriesDataPoints = baseScaleConfig
        .data!.map((baseValue, dataIndex: number) => {
          if (currentSeriesData[dataIndex] == null) {
            return null;
          }
          const values = stackedData[dataIndex];
          const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

          const minValueCoord = Math.round(Math.min(...valueCoordinates));
          const maxValueCoord = Math.round(Math.max(...valueCoordinates));

          const stackId = series[seriesId].stack;

          const result = {
            seriesId,
            dataIndex,
            layout,
            x: verticalLayout ? xScale(baseValue)! + barOffset : minValueCoord,
            y: verticalLayout ? minValueCoord : yScale(baseValue)! + barOffset,
            xOrigin: xScale(0) ?? 0,
            yOrigin: yScale(0) ?? 0,
            height: verticalLayout ? maxValueCoord - minValueCoord : barWidth,
            width: verticalLayout ? barWidth : maxValueCoord - minValueCoord,
            color: colorGetter(dataIndex),
            value: currentSeriesData[dataIndex],
            maskId: `${chartId}_${stackId || seriesId}_${groupIndex}_${dataIndex}`,
          };

          if (
            result.x > xMax ||
            result.x + result.width < xMin ||
            result.y > yMax ||
            result.y + result.height < yMin
          ) {
            return null;
          }

          if (!masks[result.maskId]) {
            masks[result.maskId] = {
              id: result.maskId,
              width: 0,
              height: 0,
              hasNegative: false,
              hasPositive: false,
              layout: result.layout,
              xOrigin: xScale(0)!,
              yOrigin: yScale(0)!,
              x: 0,
              y: 0,
            };
          }

          const mask = masks[result.maskId];
          mask.width = result.layout === 'vertical' ? result.width : mask.width + result.width;
          mask.height = result.layout === 'vertical' ? mask.height + result.height : result.height;
          mask.x = Math.min(mask.x === 0 ? Infinity : mask.x, result.x);
          mask.y = Math.min(mask.y === 0 ? Infinity : mask.y, result.y);
          mask.hasNegative = mask.hasNegative || (result.value ?? 0) < 0;
          mask.hasPositive = mask.hasPositive || (result.value ?? 0) > 0;

          return result;
        })
        .filter((rectangle) => rectangle !== null);

      return {
        seriesId,
        data: seriesDataPoints,
      };
    });
  });

  return {
    completedData: data,
    masksData: Object.values(masks),
  };
};

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
function BarPlot(props: BarPlotProps) {
  const { completedData, masksData } = useAggregatedData();
  const { skipAnimation: inSkipAnimation, onItemClick, borderRadius, barLabel, ...other } = props;
  const isZoomInteracting = useInternalIsZoomInteracting();
  const skipAnimation = useSkipAnimation(isZoomInteracting || inSkipAnimation);

  const withoutBorderRadius = !borderRadius || borderRadius <= 0;
  const classes = useUtilityClasses();

  return (
    <BarPlotRoot className={classes.root}>
      {!withoutBorderRadius &&
        masksData.map(({ id, x, y, width, height, hasPositive, hasNegative, layout }) => {
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
              width={width}
              height={height}
              skipAnimation={skipAnimation ?? false}
            />
          );
        })}
      {completedData.map(({ seriesId, data }) => {
        return (
          <g key={seriesId} data-series={seriesId} className={classes.series}>
            {data.map(
              ({ dataIndex, color, maskId, layout, x, xOrigin, y, yOrigin, width, height }) => {
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
              },
            )}
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
