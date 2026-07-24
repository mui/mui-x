import type { ChartsAxisData } from '../../../../models/axis';
import type { ProcessedSeries } from '../../corePlugins/useChartSeries';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import { isPolarSeriesType } from '../../../isPolar';

type PolarAxes = { axis: Record<string, { data?: readonly any[] }>; axisIds: string[] };

/**
 * Builds the `onAxisClick` payload for a data index on a polar axis.
 * Returns `null` when the axis has no value at this index.
 */
export function getPolarAxisClickPayload({
  dataIndex,
  isRotationAxis,
  rotationAxes,
  radiusAxes,
  processedSeries,
}: {
  dataIndex: number;
  isRotationAxis: boolean;
  rotationAxes: PolarAxes;
  radiusAxes: PolarAxes;
  processedSeries: ProcessedSeries<ChartSeriesType>;
}): ChartsAxisData | null {
  const axes = isRotationAxis ? rotationAxes : radiusAxes;
  const axisValue = axes.axis[axes.axisIds[0]]?.data?.[dataIndex];

  if (axisValue === undefined) {
    return null;
  }

  const seriesValues: ChartsAxisData['seriesValues'] = {};

  Object.keys(processedSeries)
    .filter(isPolarSeriesType)
    .forEach((seriesType) => {
      processedSeries[seriesType]?.seriesOrder.forEach((seriesId) => {
        const seriesItem = processedSeries[seriesType]!.series[seriesId];

        seriesValues[seriesId] = seriesItem.data[dataIndex];
      });
    });

  return { dataIndex, axisValue, seriesValues };
}
