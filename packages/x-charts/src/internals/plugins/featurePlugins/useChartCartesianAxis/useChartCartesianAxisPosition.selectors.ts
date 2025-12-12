import { createSelector } from '@mui/x-internals/store';
import { type ComputedAxis } from '../../../../models/axis';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { getBandSize } from '../../../../internals/getBandSize';
import { isBandScale } from '../../../../internals/scaleGuards';
import { getDataIndexForOrdinalScaleValue } from '../../../../internals/invertScale';
import { type BarItemIdentifier, type SeriesId } from '../../../../models';

export const selectorBarItemAtPosition = createSelector(
  selectorChartXAxis,
  selectorChartYAxis,
  selectorChartSeriesProcessed,
  function selectorBarItemAtPosition(
    { axis: xAxes, axisIds: xAxisIds },
    { axis: yAxes, axisIds: yAxisIds },
    processedSeries,
    svgPoint: Pick<DOMPoint, 'x' | 'y'>,
  ): BarItemIdentifier | undefined {
    const { series, stackingGroups = [] } = processedSeries?.bar ?? {};
    const defaultXAxisId = xAxisIds[0];
    const defaultYAxisId = yAxisIds[0];

    let item: { dataIndex: number; seriesId: SeriesId } | undefined = undefined;

    for (let stackIndex = 0; stackIndex < stackingGroups.length; stackIndex += 1) {
      const group = stackingGroups[stackIndex];
      const seriesIds = group.ids;

      for (const seriesId of seriesIds) {
        const aSeries = (series ?? {})[seriesId];

        const xAxisId = aSeries.xAxisId ?? defaultXAxisId;
        const yAxisId = aSeries.yAxisId ?? defaultYAxisId;

        const xAxis = xAxes[xAxisId];
        const yAxis = yAxes[yAxisId];

        const bandAxis = aSeries.layout === 'horizontal' ? yAxis : xAxis;
        const continuousAxis = aSeries.layout === 'horizontal' ? xAxis : yAxis;
        const bandScale = bandAxis.scale;
        const svgPointBandCoordinate = aSeries.layout === 'horizontal' ? svgPoint.y : svgPoint.x;

        if (!isBandScale(bandScale)) {
          continue;
        }

        const dataIndex = getDataIndexForOrdinalScaleValue(bandScale, svgPointBandCoordinate);

        const { barWidth, offset } = getBandSize(
          bandScale.bandwidth(),
          stackingGroups.length,
          (bandAxis as ComputedAxis<'band'>).barGapRatio,
        );

        const barOffset = stackIndex * (barWidth + offset);
        const bandValue = bandAxis.data?.[dataIndex];

        if (bandValue == null) {
          continue;
        }

        const bandStart = bandScale(bandValue);

        if (bandStart == null) {
          continue;
        }

        const bandBarStart = bandStart + barOffset;
        const bandBarEnd = bandBarStart + barWidth;
        const bandBarMin = Math.min(bandBarStart, bandBarEnd);
        const bandBarMax = Math.max(bandBarStart, bandBarEnd);

        if (svgPointBandCoordinate >= bandBarMin && svgPointBandCoordinate <= bandBarMax) {
          // The point is inside the band for this series
          const svgPointContinuousCoordinate =
            aSeries.layout === 'horizontal' ? svgPoint.x : svgPoint.y;
          const bar = aSeries.stackedData[dataIndex];
          const start = continuousAxis.scale(bar[0]);
          const end = continuousAxis.scale(bar[1]);

          if (start == null || end == null) {
            continue;
          }

          const continuousMin = Math.min(start, end);
          const continuousMax = Math.max(start, end);

          if (
            svgPointContinuousCoordinate >= continuousMin &&
            svgPointContinuousCoordinate <= continuousMax
          ) {
            item = {
              seriesId,
              dataIndex,
            };
          }
        }
      }
    }

    if (item) {
      return {
        type: 'bar',
        seriesId: item.seriesId,
        dataIndex: item.dataIndex,
      };
    }

    return undefined;
  },
);
