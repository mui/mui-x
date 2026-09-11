import {
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
  selectorChartSeriesProcessed,
  selectorChartXAxis,
  selectorChartYAxis,
} from '@mui/x-charts/internals';
import type { ProcessedSeries } from '@mui/x-charts/internals';
import type { ChartExcelTable, ResolvedChartExcelOptions } from './chartExcelData.types';
import { DEFAULT_CHART_EXCEL_OPTIONS } from './chartExcelData.types';
import { CHART_EXCEL_EXTRACTORS } from './extractors';
import type { AxisGetter, ChartExcelExtractorParams } from './extractors';

/** The dispatch-side view of an extractor, with the per-type series narrowing erased. */
type AnyChartExcelExtractor = (
  params: Omit<ChartExcelExtractorParams<never>, 'series'> & { series: Record<string, any> },
) => ChartExcelTable[];

type SeriesState = Parameters<typeof selectorChartSeriesProcessed>[0];
type CartesianState = Parameters<typeof selectorChartXAxis>[0];
type PolarState = Parameters<typeof selectorChartRotationAxis>[0];

/**
 * The chart store state this needs. Both axis plugins are optional: a polar chart does
 * not register the cartesian one and vice versa.
 */
export type ChartExcelSourceState = SeriesState & Partial<CartesianState> & Partial<PolarState>;

export interface CollectChartExcelTablesParams {
  processedSeries: ProcessedSeries;
  getXAxis: AxisGetter;
  getYAxis: AxisGetter;
  getRotationAxis: AxisGetter;
  getRadiusAxis: AxisGetter;
  options: ResolvedChartExcelOptions;
}

type AxesResult = { axis: Record<string, any>; axisIds: readonly (string | number)[] };

function createAxisGetter(axes: AxesResult | undefined): AxisGetter {
  return (axisId) => {
    if (!axes) {
      return undefined;
    }
    // The first id is what a series falls back to when it names no axis, which is exactly
    // what `selectorChartDefaultXAxisId` returns. It is read from `axisIds` instead so that
    // one getter serves both directions: the polar axes have no default-id selector, so
    // `useDescription` falls back to `rotationAxisIds[0]` the same way.
    const id = axisId ?? axes.axisIds[0];
    return id === undefined ? undefined : axes.axis[id];
  };
}

/** Concatenates the rows of tables sharing an id, keeping first-seen order. */
function mergeTablesById(tables: ChartExcelTable[]): ChartExcelTable[] {
  const merged = new Map<string, ChartExcelTable>();

  for (const table of tables) {
    const existing = merged.get(table.id);

    if (existing) {
      existing.rows.push(...table.rows);
    } else {
      // Copy both arrays: extractors hand back module-level column constants, which must
      // not become shared mutable state on the returned tables.
      merged.set(table.id, { ...table, columns: [...table.columns], rows: [...table.rows] });
    }
  }

  return [...merged.values()];
}

/**
 * Runs each series type's extractor and merges the results.
 *
 * Tables sharing an id are merged, so a chart with bar and line series produces a single
 * `category` table while bar and scatter produce two.
 */
export function collectChartExcelTables(params: CollectChartExcelTablesParams): ChartExcelTable[] {
  const { processedSeries, options, ...axisGetters } = params;
  const tables: ChartExcelTable[] = [];

  for (const seriesType of Object.keys(processedSeries)) {
    const group = processedSeries[seriesType as keyof ProcessedSeries];
    // One cast at the dispatch boundary, the same shape `useDescription` uses to reach the
    // per-type `descriptionGetter`.
    const extractor = CHART_EXCEL_EXTRACTORS[seriesType as keyof typeof CHART_EXCEL_EXTRACTORS] as
      AnyChartExcelExtractor | undefined;

    if (!group || !extractor) {
      continue;
    }

    tables.push(
      ...extractor({
        seriesOrder: group.seriesOrder,
        series: group.series,
        options,
        ...axisGetters,
      }),
    );
  }

  return mergeTablesById(tables);
}

/**
 * Turns a chart store snapshot into tidy tables, one row per data point.
 */
export function getChartExcelTables(
  state: ChartExcelSourceState,
  options: ResolvedChartExcelOptions = DEFAULT_CHART_EXCEL_OPTIONS,
): ChartExcelTable[] {
  // Structural checks rather than the plugin's own state types: both axis plugins are
  // optional, so the slice is genuinely absent on charts that do not register them.
  const hasCartesianAxis = (state as { cartesianAxis?: unknown }).cartesianAxis !== undefined;
  const hasPolarAxis = (state as { polarAxis?: unknown }).polarAxis !== undefined;

  return collectChartExcelTables({
    processedSeries: selectorChartSeriesProcessed(state),
    getXAxis: createAxisGetter(
      hasCartesianAxis ? (selectorChartXAxis(state as CartesianState) as AxesResult) : undefined,
    ),
    getYAxis: createAxisGetter(
      hasCartesianAxis ? (selectorChartYAxis(state as CartesianState) as AxesResult) : undefined,
    ),
    getRotationAxis: createAxisGetter(
      hasPolarAxis ? (selectorChartRotationAxis(state as PolarState) as AxesResult) : undefined,
    ),
    getRadiusAxis: createAxisGetter(
      hasPolarAxis ? (selectorChartRadiusAxis(state as PolarState) as AxesResult) : undefined,
    ),
    options,
  });
}
