import { type ChartCopilotState, type ChartItem, type RenderedItem } from './chartState';
import { applyTransform } from './transform';

export interface ChartCopilotDatasetColumn {
  field: string;
  headerName?: string;
  type?: 'number' | 'date' | 'string' | 'boolean';
}

export interface ChartCopilotDataset {
  id: string;
  columns: ChartCopilotDatasetColumn[];
  rows: readonly Record<string, any>[];
}

const coerceToNumber = (value: any): number | null => {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  const num = typeof value === 'number' ? value : Number(value);
  return Number.isNaN(num) ? null : num;
};

const resolveLabel = (item: ChartItem, column: ChartCopilotDatasetColumn | undefined): string =>
  item.label ?? column?.headerName ?? item.field;

/**
 * A resolved value item. Value columns are coerced to numbers, so the renderer's
 * narrower `values` typing is satisfied without an ad-hoc cast at the call site.
 */
export interface RenderedValueItem {
  id: string;
  label: string;
  data: (number | null)[];
}

/**
 * Maps a field-ref `ChartCopilotState` into the props expected by `ChartsRenderer`, resolving
 * each non-hidden dimension/value `ChartItem` against the dataset rows.
 *
 * This is the field-ref equivalent of the row-based mapping the grid performs in
 * `useGridChartsIntegration`.
 */
export function resolveForRenderer(
  state: ChartCopilotState,
  dataset: ChartCopilotDataset,
): {
  chartType: string;
  dimensions: RenderedItem[];
  values: RenderedValueItem[];
  configuration: Record<string, any>;
} {
  const columnsByField = new Map(dataset.columns.map((column) => [column.field, column]));

  // Apply the declarative data layer (group-by aggregation, topN, filter,
  // dateWindow) before mapping rows into series. Without this the renderer plots
  // one data point per raw row — e.g. "revenue by region" would draw one bar per
  // row instead of one per region.
  const rows = applyTransform(dataset.rows, state.transform);

  const dimensions: RenderedItem[] = state.dimensions
    .filter((item) => !item.hidden)
    .map((item) => {
      const column = columnsByField.get(item.field);
      return {
        id: item.field,
        label: resolveLabel(item, column),
        data: rows.map((row) => row[item.field]),
      };
    });

  const values: RenderedValueItem[] = state.values
    .filter((item) => !item.hidden)
    .map((item) => {
      const column = columnsByField.get(item.field);
      return {
        id: item.field,
        label: resolveLabel(item, column),
        data: rows.map((row) => coerceToNumber(row[item.field])),
      };
    });

  return {
    chartType: state.type,
    dimensions,
    values,
    configuration: state.configuration,
  };
}
