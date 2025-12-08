import { type Store } from '@mui/x-internals/store';
import type { BarItemIdentifier, SeriesId } from '../models';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { type UseChartHighlightSignature } from '../internals/plugins/featurePlugins/useChartHighlight';
import { type UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import type { ComputedAxis } from '../models/axis';
import { selectorChartSeriesProcessed } from '../internals/plugins/corePlugins/useChartSeries';
import { getBandSize } from '../internals/getBandSize';
import { isBandScale } from '../internals/scaleGuards';
import { type ChartState } from '../internals/plugins/models';

export function getBarItemAtPosition(
  store: Store<ChartState<[UseChartCartesianAxisSignature, UseChartHighlightSignature]>>,
  svgPoint: Pick<DOMPoint, 'x' | 'y'>,
): BarItemIdentifier | undefined {
  const { series, stackingGroups = [] } =
    selectorChartSeriesProcessed(store.getSnapshot())?.bar ?? {};
  const { axis: xAxes, axisIds: xAxisIds } = selectorChartXAxis(store.getSnapshot());
  const { axis: yAxes, axisIds: yAxisIds } = selectorChartYAxis(store.getSnapshot());
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

      const dataIndex =
        bandScale.bandwidth() === 0
          ? Math.floor(
              (svgPointBandCoordinate - Math.min(...bandScale.range()) + bandScale.step() / 2) /
                bandScale.step(),
            )
          : Math.floor(
              (svgPointBandCoordinate - Math.min(...bandScale.range())) / bandScale.step(),
            );

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
}
