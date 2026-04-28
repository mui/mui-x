import * as React from 'react';
import { useRadiusAxes, useRotationAxes } from '@mui/x-charts/hooks';
import { useChartsContext, type UseChartPolarAxisSignature } from '@mui/x-charts/internals';
import { type CurveType, type MarkShape, type SeriesId } from '@mui/x-charts/models';
import { useRadialLineSeriesContext } from '../hooks/useRadialLineSeries';

export interface RadialLinePoint {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  angle: number;
  dataIndex: number;
}

interface RadialLinePlotDataPoint {
  points: RadialLinePoint[];
  seriesId: SeriesId;
  color: string;
  hidden: boolean;
  showMark: boolean;
  shape: MarkShape;
  area?: boolean;
  curve?: CurveType;
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
          curve,
          shape,
          rotationAxisId = rotationAxisIds[0],
          radiusAxisId = radiusAxisIds[0],
        } = series[seriesId];

        const radiusAxis = radiusAxisMap[radiusAxisId];
        const rotationAxis = rotationAxisMap[rotationAxisId];

        const points: RadialLinePoint[] = [];

        for (let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
          if (data[dataIndex] == null) {
            continue;
          }

          const value = stackedData[dataIndex]?.[1] ?? data[dataIndex];
          const baseValue = stackedData[dataIndex]?.[0] ?? radiusAxis.scale.domain()[0];
          const radius = radiusAxis.scale(value as number)!;
          const baseRadius = radiusAxis.scale(baseValue as number)!;
          const angle = rotationAxis.scale(rotationAxis.data![dataIndex])!;

          const [x, y] = instance.polar2svg(radius, angle);
          points.push({ x, y, radius, baseRadius, angle, dataIndex });
        }
        plotData.push({
          color: series[seriesId].color,
          points,
          seriesId,
          hidden,
          showMark: Boolean(series[seriesId].showMark),
          shape: shape ?? 'circle',
          area,
          curve,
        });
      }
    }

    return plotData;
  }, [seriesData, radiusAxisMap, rotationAxisMap, radiusAxisIds, rotationAxisIds, instance]);
}
