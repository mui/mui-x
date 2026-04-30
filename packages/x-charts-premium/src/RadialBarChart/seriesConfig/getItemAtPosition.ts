import {
  type ChartState,
  type ProcessedSeries,
  type UseChartPolarAxisSignature,
  selectorAllSeriesOfType,
  selectorChartPolarCenter,
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
  getBandIndex,
  clampAngleRad,
  generateSvg2rotation,
} from '@mui/x-charts/internals';
import type { SeriesItemIdentifierWithType } from '@mui/x-charts/models';

export default function getItemAtPosition(
  state: ChartState<[UseChartPolarAxisSignature]>,
  point: { x: number; y: number },
): SeriesItemIdentifierWithType<'radialBar'> | undefined {
  const { axis: rotationAxes, axisIds: rotationAxisIds } = selectorChartRotationAxis(state);
  const { axis: radiusAxes, axisIds: radiusAxisIds } = selectorChartRadiusAxis(state);
  const center = selectorChartPolarCenter(state);
  const seriesState = selectorAllSeriesOfType(state, 'radialBar') as ProcessedSeries['radialBar'];

  if (!seriesState || seriesState.seriesOrder.length === 0) {
    return undefined;
  }

  const defaultRotationAxisId = rotationAxisIds[0];
  const defaultRadiusAxisId = radiusAxisIds[0];

  const polarCoordinate = {
    rotation: generateSvg2rotation(center)(point.x, point.y),
    radius: Math.sqrt((point.x - center.cx) ** 2 + (point.y - center.cy) ** 2),
  };

  for (let stackIndex = 0; stackIndex < seriesState.stackingGroups.length; stackIndex += 1) {
    const group = seriesState.stackingGroups[stackIndex];
    const seriesIds = group.ids;

    for (const seriesId of seriesIds) {
      const series = (seriesState.series ?? {})[seriesId];

      const rotationAxisId = series.rotationAxisId ?? defaultRotationAxisId;
      const radiusAxisId = series.radiusAxisId ?? defaultRadiusAxisId;

      const rotationAxis = rotationAxes[rotationAxisId];
      const radiusAxis = radiusAxes[radiusAxisId];

      const bandAxis = series.layout === 'horizontal' ? radiusAxis : rotationAxis;
      const continuousAxis = series.layout === 'horizontal' ? rotationAxis : radiusAxis;

      const clampedAngle =
        rotationAxis.scale.range()[0] +
        clampAngleRad(polarCoordinate.rotation - rotationAxis.scale.range()[0]);
      const bandCoordinate = series.layout === 'horizontal' ? polarCoordinate.radius : clampedAngle;
      const valueCoordinate =
        series.layout === 'horizontal' ? clampedAngle : polarCoordinate.radius;

      const dataIndex = getBandIndex(
        bandAxis,
        { groupNumber: seriesState.stackingGroups.length, groupIndex: stackIndex },
        bandCoordinate,
      );

      if (dataIndex === -1) {
        continue;
      }

      // The point is inside the band for this series
      const bar = series.visibleStackedData[dataIndex];
      const start = continuousAxis.scale(bar[0]);
      const end = continuousAxis.scale(bar[1]);

      if (start == null || end == null) {
        continue;
      }

      const continuousMin = Math.min(start, end);
      const continuousMax = Math.max(start, end);

      if (valueCoordinate >= continuousMin && valueCoordinate <= continuousMax) {
        return {
          type: 'radialBar',
          seriesId,
          dataIndex,
        };
      }
    }
  }

  return undefined;
}
