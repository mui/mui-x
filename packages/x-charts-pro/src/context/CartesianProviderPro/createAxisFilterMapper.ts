import {
  getAxisExtremum,
  FormattedSeries,
  ExtremumGettersConfig,
  ExtremumFilter,
  ZoomAxisFilters,
  GetZoomAxisFilters,
  isDefined,
} from '@mui/x-charts/internals';
import { ChartsAxisProps, ScaleName, AxisConfig } from '@mui/x-charts';
import { ZoomData } from '../ZoomProvider';
import { getScale } from '../../../../x-charts/src/internals/getScale';

type CreateAxisFilterMapperParams = {
  zoomData: ZoomData[];
  extremumGetter: ExtremumGettersConfig;
  formattedSeries: FormattedSeries;
  direction: 'x' | 'y';
};

export const createAxisFilterMapper =
  ({ zoomData, extremumGetter, formattedSeries, direction }: CreateAxisFilterMapperParams) =>
  (axis: AxisConfig<ScaleName, any, ChartsAxisProps>, axisIndex: number): ExtremumFilter | null => {
    if (typeof axis.zoom !== 'object' || axis.zoom.filterMode !== 'discard') {
      return null;
    }

    const zoom = zoomData?.find(({ axisId }) => axisId === axis.id);

    if (zoom === undefined || (zoom.start <= 0 && zoom.end >= 100)) {
      // No zoom, or zoom with all data visible
      return null;
    }

    let extremums: number[] = [];
    const scaleType = axis.scaleType;

    if (scaleType === 'point' || scaleType === 'band') {
      extremums = [0, (axis.data?.length ?? 1) - 1];
    } else {
      extremums = getAxisExtremum(axis, extremumGetter, axisIndex === 0, formattedSeries);
    }

    let min: number | Date;
    let max: number | Date;

    // @ts-expect-error The function defaults to linear scale if the scaleType is not recognized.
    [min, max] = getScale(scaleType, extremums, [0, 100]).nice().domain();

    min = min instanceof Date ? min.getTime() : min;
    max = max instanceof Date ? max.getTime() : max;

    const minVal = min + (zoom.start * (max - min)) / 100;
    const maxVal = min + (zoom.end * (max - min)) / 100;

    return (value, dataIndex) => {
      const val = value[direction] ?? axis.data?.[dataIndex];

      if (val == null) {
        // If the value does not exist because of missing data point, or out of range index, we just ignore.
        return true;
      }

      if (axis.scaleType === 'point' || axis.scaleType === 'band' || typeof val === 'string') {
        return dataIndex >= minVal && dataIndex <= maxVal;
      }

      return val >= minVal && val <= maxVal;
    };
  };

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
