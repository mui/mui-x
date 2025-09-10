import { isDefined } from '../../../isDefined';
import {
  AxisId,
  ChartsXAxisProps,
  ChartsYAxisProps,
  ContinuousScaleName,
  ScaleName,
} from '../../../../models/axis';
import { CartesianChartSeriesType } from '../../../../models/seriesType/config';
import { ProcessedSeries } from '../../corePlugins/useChartSeries';
import { AxisConfig } from '../../../../models';
import { ChartSeriesConfig } from '../../models/seriesConfig';
import { getAxisExtremum } from './getAxisExtremum';
import { DefaultizedZoomOptions, ExtremumFilter } from './useChartCartesianAxis.types';
import { GetZoomAxisFilters, ZoomAxisFilters, ZoomData } from './zoom.types';
import { getAxisDomainLimit } from './getAxisDomainLimit';
import { applyDomainLimit } from './applyDomainLimit';

type CreateAxisFilterMapperParams = {
  zoomMap: Map<AxisId, ZoomData>;
  zoomOptions: Record<AxisId, DefaultizedZoomOptions>;
  seriesConfig: ChartSeriesConfig<CartesianChartSeriesType>;
  formattedSeries: ProcessedSeries;
  direction: 'x' | 'y';
  preferStrictDomainInLineCharts: boolean;
};

export function createAxisFilterMapper(params: {
  zoomMap: Map<AxisId, ZoomData>;
  zoomOptions: Record<AxisId, DefaultizedZoomOptions>;
  seriesConfig: ChartSeriesConfig<CartesianChartSeriesType>;
  formattedSeries: ProcessedSeries;
  direction: 'x';
  preferStrictDomainInLineCharts: boolean;
}): (
  axis: AxisConfig<ScaleName, any, ChartsXAxisProps>,
  axisIndex: number,
) => ExtremumFilter | null;
export function createAxisFilterMapper(params: {
  zoomMap: Map<AxisId, ZoomData>;
  zoomOptions: Record<AxisId, DefaultizedZoomOptions>;
  seriesConfig: ChartSeriesConfig<CartesianChartSeriesType>;
  formattedSeries: ProcessedSeries;
  direction: 'y';
  preferStrictDomainInLineCharts: boolean;
}): (
  axis: AxisConfig<ScaleName, any, ChartsYAxisProps>,
  axisIndex: number,
) => ExtremumFilter | null;
export function createAxisFilterMapper({
  zoomMap,
  zoomOptions,
  seriesConfig,
  formattedSeries,
  direction,
  preferStrictDomainInLineCharts,
}: CreateAxisFilterMapperParams) {
  return (axis: AxisConfig, axisIndex: number): ExtremumFilter | null => {
    const zoomOption = zoomOptions[axis.id];
    if (!zoomOption || zoomOption.filterMode !== 'discard') {
      return null;
    }

    const zoom = zoomMap?.get(axis.id);

    if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
      // No zoom, or zoom with all data visible
      return null;
    }

    const scaleType = axis.scaleType;

    if (scaleType === 'point' || scaleType === 'band') {
      return createDiscreteScaleGetAxisFilter(axis.data, zoom.start, zoom.end, direction);
    }

    const domainLimit = getAxisDomainLimit(axis, direction, axisIndex, formattedSeries, preferStrictDomainInLineCharts);

    return createContinuousScaleGetAxisFilter(
      scaleType,
      getAxisExtremum(axis, direction, seriesConfig, axisIndex, formattedSeries),
      zoom.start,
      zoom.end,
      direction,
      axis.data,
      domainLimit,
    );
  };
}

export function createDiscreteScaleGetAxisFilter(
  axisData: AxisConfig['data'],
  zoomStart: number,
  zoomEnd: number,
  direction: 'x' | 'y',
): ExtremumFilter {
  const maxIndex = axisData?.length ?? 0;

  const minVal = Math.floor((zoomStart * maxIndex) / 100);
  const maxVal = Math.ceil((zoomEnd * maxIndex) / 100);

  return function filterAxis(value, dataIndex) {
    const val = value[direction] ?? axisData?.[dataIndex];

    if (val == null) {
      // If the value does not exist because of missing data point, or out of range index, we just ignore.
      return true;
    }

    return dataIndex >= minVal && dataIndex < maxVal;
  };
}

export function createContinuousScaleGetAxisFilter(
  scaleType: ContinuousScaleName | undefined,
  extrema: readonly [number, number],
  zoomStart: number,
  zoomEnd: number,
  direction: 'x' | 'y',
  axisData: AxisConfig['data'],
  domainLimit: 'nice' | 'strict' | ((min: number, max: number) => { min: number; max: number }),
): ExtremumFilter {
  let min: number | Date;
  let max: number | Date;

  const { scale: finalScale } = applyDomainLimit(extrema, domainLimit, scaleType ?? 'linear', [0, 100]);
  [min, max] = finalScale.domain();

  min = min instanceof Date ? min.getTime() : min;
  max = max instanceof Date ? max.getTime() : max;

  const minVal = min + (zoomStart * (max - min)) / 100;
  const maxVal = min + (zoomEnd * (max - min)) / 100;

  return function filterAxis(value, dataIndex) {
    const val = value[direction] ?? axisData?.[dataIndex];

    if (val == null) {
      // If the value does not exist because of missing data point, or out of range index, we just ignore.
      return true;
    }

    return val >= minVal && val <= maxVal;
  };
}

export const createGetAxisFilters =
  (filters: ZoomAxisFilters): GetZoomAxisFilters =>
    ({ currentAxisId, seriesXAxisId, seriesYAxisId, isDefaultAxis }) => {
      return (value, dataIndex) => {
        const axisId = currentAxisId === seriesXAxisId ? seriesYAxisId : seriesXAxisId;

        if (!axisId || isDefaultAxis) {
          return Object.values(filters ?? {})[0]?.(value, dataIndex) ?? true;
        }

        const data = [seriesYAxisId, seriesXAxisId]
          .filter((id) => id !== currentAxisId)
          .map((id) => filters[id ?? ''])
          .filter(isDefined);
        return data.every((f) => f(value, dataIndex));
      };
    };
