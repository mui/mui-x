import type {} from '../../../typeOverloads';
import type { ChartSeriesType } from '@mui/x-charts/internals';
import type { ChartExcelExtractor } from './types';
import {
  barExtractor,
  lineExtractor,
  radarExtractor,
  radialBarExtractor,
  radialLineExtractor,
} from './categoryValue';
import { scatterExtractor } from './scatter';
import { pieExtractor } from './pie';
import { funnelExtractor } from './funnel';
import { heatmapExtractor } from './heatmap';
import { rangeBarExtractor } from './rangeBar';
import { ohlcExtractor } from './ohlc';
import { mapShapeExtractor } from './mapShape';
import { sankeyExtractor } from './sankey';

/**
 * Every series type's Excel extractor, keyed the same way `ProcessedSeries` is, so
 * dispatch is a plain lookup.
 *
 * `satisfies` against the required mapped type rather than a type annotation: it makes
 * omitting a series type a build error, while keeping the literal inferred type so that a
 * consumer augmenting `ChartsSeriesConfig` does not get a declaration promising a key
 * that has no extractor behind it.
 */
export const CHART_EXCEL_EXTRACTORS = {
  bar: barExtractor,
  line: lineExtractor,
  radar: radarExtractor,
  radialLine: radialLineExtractor,
  radialBar: radialBarExtractor,
  scatter: scatterExtractor,
  pie: pieExtractor,
  funnel: funnelExtractor,
  heatmap: heatmapExtractor,
  rangeBar: rangeBarExtractor,
  ohlc: ohlcExtractor,
  mapShape: mapShapeExtractor,
  sankey: sankeyExtractor,
} satisfies { [T in ChartSeriesType]: ChartExcelExtractor<T> };

export type { ChartExcelExtractor, ChartExcelExtractorParams, AxisGetter } from './types';
