import { getLabel } from '@mui/x-charts/internals';
import type { ComputedAxis } from '@mui/x-charts/internals';
import type { SeriesId } from '@mui/x-charts/models';
import type { ChartExcelColumn } from '../chartExcelData.types';

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

/** Inserts a `formatted*` column immediately after the column it formats. */
export function withFormattedColumn(
  columns: ChartExcelColumn[],
  afterKey: string,
  formattedKey: string,
  header: string,
): ChartExcelColumn[] {
  const index = columns.findIndex((column) => column.key === afterKey);
  const next = [...columns];
  next.splice(index + 1, 0, { key: formattedKey, header });
  return next;
}
