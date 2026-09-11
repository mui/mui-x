import { getLabel } from '@mui/x-charts/internals';
import type { ComputedAxis } from '@mui/x-charts/internals';
import type { SeriesId } from '@mui/x-charts/models';
import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';

/** The `series` cell: the legend label when there is one, the series id otherwise. */
export function getSeriesLabel(
  label: string | ((location: 'tooltip' | 'legend') => string | undefined) | undefined,
  id: SeriesId,
): string {
  return getLabel(label, 'legend') ?? String(id);
}

/**
 * The category cell for an index-aligned series.
 *
 * `axis.data` is populated from `data`, `dataKey` and `valueGetter` regardless of the scale
 * type, so this returns real values for dataset-driven charts. It falls back to the index
 * only when none of those were given, and there the index is the plotted coordinate.
 */
export function getCategory(axis: ComputedAxis | undefined, dataIndex: number): unknown {
  return axis?.data?.[dataIndex] ?? dataIndex;
}

export const FORMATTED_VALUE_KEY = 'formattedValue';

/**
 * Inserts the `formattedValue` column immediately after the column it formats.
 *
 * Every series type but OHLC formats one value per row, so they all insert the same single
 * column and differ only in which column it follows. OHLC formats each of its four fields
 * separately and builds its own columns.
 */
export function withFormattedValueColumn(
  columns: ChartExcelColumn[],
  afterKey: string,
): ChartExcelColumn[] {
  const index = columns.findIndex((column) => column.key === afterKey);
  const next = [...columns];
  next.splice(index + 1, 0, { key: FORMATTED_VALUE_KEY, header: FORMATTED_VALUE_KEY });
  return next;
}

/**
 * Wraps one table, or nothing when the series produced no rows. A chart whose every series
 * is empty or filtered out should contribute no sheet at all.
 */
export function toTables(
  id: ChartExcelTable['id'],
  columns: ChartExcelColumn[],
  rows: ChartExcelTable['rows'],
): ChartExcelTable[] {
  return rows.length === 0 ? [] : [{ id, columns, rows }];
}
