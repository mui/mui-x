'use client';
import * as React from 'react';
import {
  getSVGPoint,
  getCartesianAxisIndex,
  selectorChartXAxis,
  selectorChartYAxis,
  selectorAllSeriesOfType,
} from '@mui/x-charts/internals';
import type {
  SeriesId,
  ChartPlugin,
  ChartPluginSignature,
  ComputedAxis,
  ChartsXAxisProps,
  ChartsYAxisProps,
  ProcessedSeries,
  UseChartCartesianAxisSignature,
} from '@mui/x-charts/internals';

export type OnCellClickParams<XValueType = any, YValueType = any> = {
  x: {
    index: number;
    value: XValueType;
  };
  y: {
    index: number;
    value: YValueType;
  };
  cell?: {
    dataIndex: number;
    seriesId: SeriesId;
    value: number;
  };
};

export interface UseHeatmapCellClickParameters {
  /**
   * Callback fired when a cell is clicked.
   * @param {PointerEvent} event The native pointer event
   * @param {OnCellClickParams} params The parameters related to the clicked cell
   */
  onCellClick?: (event: PointerEvent, params: OnCellClickParams) => void;
}

export type UseHeatmapCellClickSignature = ChartPluginSignature<{
  params: UseHeatmapCellClickParameters;
  defaultizedParams: UseHeatmapCellClickParameters;
  dependencies: [UseChartCartesianAxisSignature];
}>;

export const useHeatmapCellClick: ChartPlugin<UseHeatmapCellClickSignature> = ({
  svgRef,
  instance,
  store,
  params,
}) => {
  const { axis: xAxis, axisIds: xAxisIds } = store.use(selectorChartXAxis);
  const { axis: yAxis, axisIds: yAxisIds } = store.use(selectorChartYAxis);
  const series = store.use(selectorAllSeriesOfType, 'heatmap') as ProcessedSeries['heatmap'];

  const xAxisWithScale = xAxis[xAxisIds[0]] as ComputedAxis<'band', any, ChartsXAxisProps>;
  const yAxisWithScale = yAxis[yAxisIds[0]] as ComputedAxis<'band', any, ChartsYAxisProps>;

  const { onCellClick } = params;

  React.useEffect(() => {
    const element = svgRef.current;

    if (element === null || !onCellClick) {
      return undefined;
    }

    const seriesId = series?.seriesOrder[0];

    if (seriesId === undefined) {
      return undefined;
    }

    const onClickHandler = (event: PointerEvent): void => {
      const svgPoint = getSVGPoint(element, event);

      if (!svgPoint || !instance.isPointInside(svgPoint.x, svgPoint.y)) {
        return;
      }

      const xIndex = getCartesianAxisIndex(xAxisWithScale, svgPoint.x);
      const yIndex = getCartesianAxisIndex(yAxisWithScale, svgPoint.y);

      if (xIndex === -1 || yIndex === -1) {
        return;
      }

      const dataIndex = series
        ? series.series[series.seriesOrder[0]].data.findIndex(
            (d) => d[0] === xIndex && d[1] === yIndex,
          )
        : -1;

      const xValue = xAxisWithScale.data?.[xIndex];
      const yValue = yAxisWithScale.data?.[yIndex];

      const cellValue =
        dataIndex !== -1 && series ? series.series[seriesId].data[dataIndex][2] : undefined;

      onCellClick(event, {
        x: { index: xIndex, value: xValue },
        y: { index: yIndex, value: yValue },
        cell:
          dataIndex !== -1 && cellValue !== undefined
            ? { dataIndex, seriesId, value: cellValue }
            : undefined,
      });
    };

    element.addEventListener('click', onClickHandler);

    return () => {
      element.removeEventListener('click', onClickHandler);
    };
  }, [onCellClick, svgRef, xAxisWithScale, yAxisWithScale, series, instance]);
  return {};
};

useHeatmapCellClick.params = {
  onCellClick: true,
};
