import * as React from 'react';
import PropTypes from 'prop-types';
import { useTransition } from '@react-spring/web';
import { SeriesContext } from '../context/SeriesContextProvider';
import { CartesianContext } from '../context/CartesianContextProvider';
import { BarElement, BarElementProps, BarElementSlotProps, BarElementSlots } from './BarElement';
import { AxisDefaultized, isBandScaleConfig, isPointScaleConfig } from '../models/axis';
import { FormatterResult } from '../models/seriesType/config';
import { HighlightScope } from '../context/HighlightProvider';
import { BarItemIdentifier, BarSeriesType } from '../models';
import { DEFAULT_X_AXIS_KEY, DEFAULT_Y_AXIS_KEY } from '../constants';
import { SeriesId } from '../models/seriesType/common';
import getColor from './getColor';

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

export interface BarPlotSlots extends BarElementSlots {}

export interface BarPlotSlotProps extends BarElementSlotProps {}

export interface BarPlotProps extends Pick<BarElementProps, 'slots' | 'slotProps'> {
  /**
   * If `true`, animations are skipped.
   * @default false
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
}

interface CompletedBarData {
  seriesId: SeriesId;
  dataIndex: number;
  layout: BarSeriesType['layout'];
  x: number;
  y: number;
  xOrigin: number;
  yOrigin: number;
  height: number;
  width: number;
  color: string;
  highlightScope?: Partial<HighlightScope>;
}

const useAggregatedData = (): CompletedBarData[] => {
  const seriesData =
    React.useContext(SeriesContext).bar ??
    ({ series: {}, stackingGroups: [], seriesOrder: [] } as FormatterResult<'bar'>);
  const axisData = React.useContext(CartesianContext);

  const { series, stackingGroups } = seriesData;
  const { xAxis, yAxis, xAxisIds, yAxisIds } = axisData;
  const defaultXAxisId = xAxisIds[0];
  const defaultYAxisId = yAxisIds[0];

  const data = stackingGroups.flatMap(({ ids: groupIds }, groupIndex) => {
    return groupIds.flatMap((seriesId) => {
      const xAxisKey = series[seriesId].xAxisKey ?? defaultXAxisId;
      const yAxisKey = series[seriesId].yAxisKey ?? defaultYAxisId;

      const xAxisConfig = xAxis[xAxisKey];
      const yAxisConfig = yAxis[yAxisKey];

      const verticalLayout = series[seriesId].layout === 'vertical';
      let baseScaleConfig: AxisDefaultized<'band'>;

      if (verticalLayout) {
        if (!isBandScaleConfig(xAxisConfig)) {
          throw new Error(
            `MUI X Charts: ${
              xAxisKey === DEFAULT_X_AXIS_KEY
                ? 'The first `xAxis`'
                : `The x-axis with id "${xAxisKey}"`
            } shoud be of type "band" to display the bar series of id "${seriesId}".`,
          );
        }
        if (xAxis[xAxisKey].data === undefined) {
          throw new Error(
            `MUI X Charts: ${
              xAxisKey === DEFAULT_X_AXIS_KEY
                ? 'The first `xAxis`'
                : `The x-axis with id "${xAxisKey}"`
            } shoud have data property.`,
          );
        }
        baseScaleConfig = xAxisConfig as AxisDefaultized<'band'>;
        if (isBandScaleConfig(yAxisConfig) || isPointScaleConfig(yAxisConfig)) {
          throw new Error(
            `MUI X Charts: ${
              yAxisKey === DEFAULT_Y_AXIS_KEY
                ? 'The first `yAxis`'
                : `The y-axis with id "${yAxisKey}"`
            } shoud be a continuous type to display the bar series of id "${seriesId}".`,
          );
        }
      } else {
        if (!isBandScaleConfig(yAxisConfig)) {
          throw new Error(
            `MUI X Charts: ${
              yAxisKey === DEFAULT_Y_AXIS_KEY
                ? 'The first `yAxis`'
                : `The y-axis with id "${yAxisKey}"`
            } shoud be of type "band" to display the bar series of id "${seriesId}".`,
          );
        }

        if (yAxis[yAxisKey].data === undefined) {
          throw new Error(
            `MUI X Charts: ${
              yAxisKey === DEFAULT_Y_AXIS_KEY
                ? 'The first `yAxis`'
                : `The y-axis with id "${yAxisKey}"`
            } shoud have data property.`,
          );
        }
        baseScaleConfig = yAxisConfig as AxisDefaultized<'band'>;
        if (isBandScaleConfig(xAxisConfig) || isPointScaleConfig(xAxisConfig)) {
          throw new Error(
            `MUI X Charts: ${
              xAxisKey === DEFAULT_X_AXIS_KEY
                ? 'The first `xAxis`'
                : `The x-axis with id "${xAxisKey}"`
            } shoud be a continuous type to display the bar series of id "${seriesId}".`,
          );
        }
      }

      const xScale = xAxisConfig.scale;
      const yScale = yAxisConfig.scale;

      const colorGetter = getColor(series[seriesId], xAxis[xAxisKey], yAxis[yAxisKey]);
      const bandWidth = baseScaleConfig.scale.bandwidth();

      const { barWidth, offset } = getBandSize({
        bandWidth,
        numberOfGroups: stackingGroups.length,
        gapRatio: baseScaleConfig.barGapRatio,
      });
      const barOffset = groupIndex * (barWidth + offset);

      const { stackedData } = series[seriesId];

      return stackedData.map((values, dataIndex: number) => {
        const valueCoordinates = values.map((v) => (verticalLayout ? yScale(v)! : xScale(v)!));

        const minValueCoord = Math.round(Math.min(...valueCoordinates));
        const maxValueCoord = Math.round(Math.max(...valueCoordinates));

        return {
          seriesId,
          dataIndex,
          layout: series[seriesId].layout,
          x: verticalLayout
            ? xScale(xAxis[xAxisKey].data?.[dataIndex])! + barOffset
            : minValueCoord!,
          y: verticalLayout
            ? minValueCoord
            : yScale(yAxis[yAxisKey].data?.[dataIndex])! + barOffset,
          xOrigin: xScale(0)!,
          yOrigin: yScale(0)!,
          height: verticalLayout ? maxValueCoord - minValueCoord : barWidth,
          width: verticalLayout ? barWidth : maxValueCoord - minValueCoord,
          color: colorGetter(dataIndex),
          highlightScope: series[seriesId].highlightScope,
        };
      });
    });
  });

  return data;
};

const getOutStyle = ({ layout, yOrigin, x, width, y, xOrigin, height }: CompletedBarData) => ({
  ...(layout === 'vertical'
    ? {
        y: yOrigin,
        x,
        height: 0,
        width,
      }
    : {
        y,
        x: xOrigin,
        height,
        width: 0,
      }),
});

const getInStyle = ({ x, width, y, height }: CompletedBarData) => ({
  y,
  x,
  height,
  width,
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
  const completedData = useAggregatedData();
  const { skipAnimation, onItemClick, ...other } = props;

  const transition = useTransition(completedData, {
    keys: (bar) => `${bar.seriesId}-${bar.dataIndex}`,
    from: getOutStyle,
    leave: getOutStyle,
    enter: getInStyle,
    update: getInStyle,
    immediate: skipAnimation,
  });
  return (
    <React.Fragment>
      {transition((style, { seriesId, dataIndex, color, highlightScope }) => (
        <BarElement
          id={seriesId}
          dataIndex={dataIndex}
          highlightScope={highlightScope}
          color={color}
          {...other}
          onClick={
            onItemClick &&
            ((event) => {
              onItemClick(event, { type: 'bar', seriesId, dataIndex });
            })
          }
          style={style}
        />
      ))}
    </React.Fragment>
  );
}

BarPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Callback fired when a bar item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {BarItemIdentifier} barItemIdentifier The bar item identifier.
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

export { BarPlot };
