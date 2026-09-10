import type {
  AxisId,
  ChartSeriesDefaultized,
  ChartSeriesType,
  ComputedAxis,
} from '@mui/x-charts/internals';
import type { SeriesId } from '@mui/x-charts/models';
import type { ChartExcelTable, ResolvedChartExcelOptions } from '../chartExcelData.types';

/**
 * Resolves an axis by id, falling back to the chart's default axis for that direction.
 * @param {AxisId} [axisId] The axis the series names, if any.
 * @returns {ComputedAxis | undefined} The axis, or `undefined` when the chart does not
 *   register the matching axis plugin.
 */
export type AxisGetter = (axisId?: AxisId) => ComputedAxis | undefined;

export interface ChartExcelExtractorParams<T extends ChartSeriesType> {
  seriesOrder: readonly SeriesId[];
  series: Record<SeriesId, ChartSeriesDefaultized<T>>;
  getXAxis: AxisGetter;
  getYAxis: AxisGetter;
  getRotationAxis: AxisGetter;
  getRadiusAxis: AxisGetter;
  options: ResolvedChartExcelOptions;
}

/**
 * Turns one series type's data into tidy tables: one row per data point, one column per
 * measure.
 * @param {ChartExcelExtractorParams} params The series group and the resolved axes.
 * @returns {ChartExcelTable[]} The tables, several only for the series types that
 *   genuinely need them, such as sankey with its nodes and links.
 */
export type ChartExcelExtractor<T extends ChartSeriesType> = (
  params: ChartExcelExtractorParams<T>,
) => ChartExcelTable[];
