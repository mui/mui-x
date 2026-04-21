import * as React from 'react';
import { useRadiusAxes, useRotationAxes } from '@mui/x-charts/hooks';
import { useChartsContext, type UseChartPolarAxisSignature } from '@mui/x-charts/internals';
import { type SeriesId } from '@mui/x-charts/models';
import { useRadialLineSeriesContext } from '../hooks/useRadialLineSeries';

interface RadialLinePlotDataPoint {
  d: string;
  points: { x: number; y: number; dataIndex: number }[];
  seriesId: SeriesId;
  color: string;
  hidden: boolean;
  area?: boolean;
}

export function useRadialLinePlotData() {
  const { instance } = useChartsContext<[UseChartPolarAxisSignature]>();
  const { radiusAxis: radiusAxisMap, radiusAxisIds } = useRadiusAxes();
  const { rotationAxis: rotationAxisMap, rotationAxisIds } = useRotationAxes();
  const seriesData = useRadialLineSeriesContext();

  return React.useMemo(() => {
    if (seriesData === undefined || !radiusAxisMap || !rotationAxisMap) {
      return [];
    }

    const { series, stackingGroups } = seriesData;
    const plotData: RadialLinePlotDataPoint[] = [];

    for (const stackingGroup of stackingGroups) {
      for (const seriesId of stackingGroup.ids) {
        const {
          stackedData,
          data,
          hidden,
          area = false,
          rotationAxisId = rotationAxisIds[0],
          radiusAxisId = radiusAxisIds[0],
        } = series[seriesId];

        const radiusAxis = radiusAxisMap[radiusAxisId];
        const rotationAxis = rotationAxisMap[rotationAxisId];

        const points: { x: number; y: number; dataIndex: number }[] = [];

        for (let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
          if (data[dataIndex] == null) {
            continue;
          }

          const value = stackedData[dataIndex]?.[1] ?? data[dataIndex];
          const r = radiusAxis.scale(value as number)!;
          const angle = rotationAxis.scale(rotationAxis.data![dataIndex])!;

          const [x, y] = instance.polar2svg(r, angle);
          points.push({ x, y, dataIndex });
        }

        // Build a closed polygon path.
        const d = points.length > 0 ? `M ${points.map((p) => `${p.x} ${p.y}`).join(' L ')} Z` : '';

        plotData.push({
          color: series[seriesId].color,
          d,
          points,
          seriesId,
          hidden,
          area,
        });
      }
    }

    return plotData;
  }, [seriesData, radiusAxisMap, rotationAxisMap, radiusAxisIds, rotationAxisIds, instance]);
}
