import { createSelector } from '@mui/x-internals/store';
import { selectorChartXAxis, selectorChartYAxis } from './useChartCartesianAxisRendering.selectors';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries';
import { getBandSize } from '../../../../internals/getBandSize';
import { isBandScale } from '../../../../internals/scaleGuards';
import { getDataIndexForOrdinalScaleValue } from '../../../../internals/invertScale';
import type {
  ChartsRadialAxisProps,
  ChartsCartesianAxisProps,
  ComputedAxis,
} from '../../../../models/axis';
import type { ScaleName, BarItemIdentifier, SeriesId } from '../../../../models';

export function getBandIndex(
  bandAxis: ComputedAxis<ScaleName, any, ChartsCartesianAxisProps | ChartsRadialAxisProps>,
  stackConfig: { groupNumber: number; groupIndex: number },
  coordinate: number,
): number {
  if (!isBandScale(bandAxis.scale)) {
    return -1;
  }
  const dataIndex = getDataIndexForOrdinalScaleValue(bandAxis.scale, coordinate);

  const { barWidth, offset } = getBandSize(
    bandAxis.scale.bandwidth(),
    stackConfig.groupNumber,
    (bandAxis as ComputedAxis<'band', any, ChartsCartesianAxisProps | ChartsRadialAxisProps>)
      .barGapRatio,
  );

  const barOffset = stackConfig.groupIndex * (barWidth + offset);
  const bandValue = bandAxis.data?.[dataIndex];

  if (bandValue == null) {
    return -1;
  }

  const bandStart = bandAxis.scale(bandValue);

  if (bandStart == null) {
    return -1;
  }

  const bandBarStart = bandStart + barOffset;
  const bandBarEnd = bandBarStart + barWidth;
  const bandBarMin = Math.min(bandBarStart, bandBarEnd);
  const bandBarMax = Math.max(bandBarStart, bandBarEnd);

  if (coordinate >= bandBarMin && coordinate <= bandBarMax) {
    return dataIndex;
  }
  return -1;
}

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
        const svgBandCoordinate = aSeries.layout === 'horizontal' ? svgPoint.y : svgPoint.x;
        const svgValueCoordinate = aSeries.layout === 'horizontal' ? svgPoint.x : svgPoint.y;

        const dataIndex = getBandIndex(
          bandAxis,
          { groupNumber: stackingGroups.length, groupIndex: stackIndex },
          svgBandCoordinate,
        );

        if (dataIndex === -1) {
          continue;
        }

        // The point is inside the band for this series
        const bar = aSeries.visibleStackedData[dataIndex];
        const start = continuousAxis.scale(bar[0]);
        const end = continuousAxis.scale(bar[1]);

        if (start == null || end == null) {
          continue;
        }

        const continuousMin = Math.min(start, end);
        const continuousMax = Math.max(start, end);

        if (svgValueCoordinate >= continuousMin && svgValueCoordinate <= continuousMax) {
          item = {
            seriesId,
            dataIndex,
          };
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
