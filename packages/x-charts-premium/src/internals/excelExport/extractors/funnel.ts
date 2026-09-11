import { getLabel } from '@mui/x-charts/internals';
import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { ChartExcelExtractor } from './types';
import { getSeriesLabel, toTables, withFormattedValueColumn } from './utils';

const BASE_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'id', header: 'id' },
  { key: 'label', header: 'label' },
  { key: 'value', header: 'value' },
];

/**
 * Funnel sections are ordered stages carrying their own id and label. The parallel
 * `dataPoints` array on the series holds polygon corners, which is layout rather than
 * data, so it is excluded.
 */
export const funnelExtractor: ChartExcelExtractor<'funnel'> = (params) => {
  const { seriesOrder, series, options } = params;
  const { escapeFormulas, includeFormattedValues } = options;

  const rows: ChartExcelTable['rows'] = [];

  for (const seriesId of seriesOrder) {
    const item = series[seriesId];

    // Funnel carries no `hidden` flag, at series or at section level.
    if (!item) {
      continue;
    }

    const seriesLabel = getSeriesLabel(item.label, item.id);

    item.data.forEach((section, dataIndex) => {
      const row: ChartExcelTable['rows'][number] = {
        series: toSafeCell(seriesLabel, escapeFormulas),
        id: toSafeCell(section.id, escapeFormulas),
        label: toSafeCell(getLabel(section.label, 'legend'), escapeFormulas),
        value: toCell(section.value),
      };

      if (includeFormattedValues) {
        row.formattedValue = toSafeCell(
          item.valueFormatter?.(section, { dataIndex }),
          escapeFormulas,
        );
      }

      rows.push(row);
    });
  }

  const columns = includeFormattedValues
    ? withFormattedValueColumn(BASE_COLUMNS, 'value')
    : BASE_COLUMNS;

  return toTables('funnel', columns, rows);
};
