import * as React from 'react';
import { useRadiusAxes, useRotationAxes } from '../hooks/useAxis';
import { useLineSeriesContext } from '../hooks/useLineSeries';
import { type UseChartPolarAxisSignature } from '../internals/plugins/featurePlugins/useChartPolarAxis';
import { useChartsContext } from '../context/ChartsProvider/useChartsContext';
import { type SeriesId } from '../models/seriesType/common';

interface PolarLinePlotDataPoint {
  d: string;
  seriesId: SeriesId;
  color: string;
  hidden: boolean;
}

export function usePolarLinePlotData() {
  const { instance } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { radiusAxis: radiusAxisMap, radiusAxisIds } = useRadiusAxes();
  const { rotationAxis: rotationAxisMap, rotationAxisIds } = useRotationAxes();
  const seriesData = useLineSeriesContext();

  return React.useMemo(() => {
    if (seriesData === undefined || !radiusAxisMap || !rotationAxisMap) {
      return [];
    }

    const { series, stackingGroups } = seriesData;
    const plotData: PolarLinePlotDataPoint[] = [];

    for (const stackingGroup of stackingGroups) {
      for (const seriesId of stackingGroup.ids) {
        const { stackedData, data, hidden, xAxisId, yAxisId } = series[seriesId];

        const radiusAxisId = xAxisId ?? radiusAxisIds[0];
        const rotationAxisId = yAxisId ?? rotationAxisIds[0];

        const radiusAxis = radiusAxisMap[radiusAxisId];
        const rotationAxis = rotationAxisMap[rotationAxisId];

        const points: { x: number; y: number }[] = [];

        for (let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
          if (data[dataIndex] == null) {
            continue;
          }

          const value = stackedData[dataIndex]?.[1] ?? data[dataIndex];
          const r = radiusAxis.scale(value as number)!;
          const angle = rotationAxis.scale(rotationAxis.data![dataIndex])!;
          const [x, y] = instance.polar2svg(r, angle);
          points.push({ x, y });
        }

        // Build a closed polygon path.
        const d = points.length > 0 ? `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z` : '';

        plotData.push({
          color: series[seriesId].color,
          d,
          seriesId,
          hidden,
        });
      }
    }

    return plotData;
  }, [seriesData, radiusAxisMap, rotationAxisMap, radiusAxisIds, rotationAxisIds, instance]);
}
