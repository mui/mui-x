import { getLabel } from '@mui/x-charts/internals';
import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { ChartExcelExtractor } from './types';
import { toTables, withFormattedValueColumn } from './utils';

const BASE_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'id', header: 'id' },
  { key: 'label', header: 'label' },
  { key: 'value', header: 'value' },
];

/**
 * Pie slices carry their own id and label, so the label is the category. Arc geometry
 * (start, end and pad angles) is layout, not data, and is excluded. Visibility is per
 * item here rather than per series, since a legend click hides one slice.
 */
export const pieExtractor: ChartExcelExtractor<'pie'> = (params) => {
  const { seriesOrder, series, options } = params;
  const { escapeFormulas, includeFormattedValues, includeHiddenSeries } = options;

  const rows: ChartExcelTable['rows'] = [];

  for (const seriesId of seriesOrder) {
    const item = series[seriesId];

    if (!item) {
      continue;
    }

    // The pie series has no series-level label; only its slices are labelled.
    const seriesLabel = String(item.id);

    for (const slice of item.data) {
      if (!includeHiddenSeries && slice.hidden) {
        continue;
      }

      const row: ChartExcelTable['rows'][number] = {
        series: toSafeCell(seriesLabel, escapeFormulas),
        id: toSafeCell(slice.id, escapeFormulas),
        label: toSafeCell(getLabel(slice.label, 'legend'), escapeFormulas),
        value: toCell(slice.value),
      };

      if (includeFormattedValues) {
        // Pie precomputes this while defaultizing, so there is nothing to call.
        row.formattedValue = toSafeCell(slice.formattedValue, escapeFormulas);
      }

      rows.push(row);
    }
  }

  const columns = includeFormattedValues
    ? withFormattedValueColumn(BASE_COLUMNS, 'value')
    : BASE_COLUMNS;

  return toTables('pie', columns, rows);
};
