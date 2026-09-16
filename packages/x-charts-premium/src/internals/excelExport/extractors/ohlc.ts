import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { OHLCField } from '../../../models';
import type { ChartExcelExtractor } from './types';
import { getCategory, getSeriesLabel, toTables } from './utils';

const FIELDS: OHLCField[] = ['open', 'high', 'low', 'close'];

const BASE_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'category', header: 'category' },
  ...FIELDS.map((field) => ({ key: field, header: field })),
];

const FORMATTED_COLUMNS: ChartExcelColumn[] = [
  ...BASE_COLUMNS,
  ...FIELDS.map((field) => ({
    key: `formatted${field[0].toUpperCase()}${field.slice(1)}`,
    header: `formatted${field[0].toUpperCase()}${field.slice(1)}`,
  })),
];

/**
 * OHLC carries `[open, high, low, close]` per point. There is no volume.
 *
 * Its `valueFormatter` is called once per field rather than once per point, so formatted
 * output needs four calls and four columns.
 */
export const ohlcExtractor: ChartExcelExtractor<'ohlc'> = (params) => {
  const { seriesOrder, series, options, getXAxis } = params;
  const { escapeFormulas, includeFormattedValues, includeHiddenSeries } = options;

  const rows: ChartExcelTable['rows'] = [];

  for (const seriesId of seriesOrder) {
    const item = series[seriesId];

    if (!item || (!includeHiddenSeries && item.hidden)) {
      continue;
    }

    const axis = getXAxis(item.xAxisId);
    const seriesLabel = getSeriesLabel(item.label, item.id);

    item.data.forEach((value, dataIndex) => {
      const row: ChartExcelTable['rows'][number] = {
        series: toSafeCell(seriesLabel, escapeFormulas),
        category: toSafeCell(getCategory(axis, dataIndex), escapeFormulas),
      };

      FIELDS.forEach((field, fieldIndex) => {
        const fieldValue = value?.[fieldIndex] ?? null;
        row[field] = toCell(fieldValue);

        if (includeFormattedValues) {
          const key = `formatted${field[0].toUpperCase()}${field.slice(1)}`;
          row[key] = toSafeCell(
            item.valueFormatter?.(fieldValue, { dataIndex, field }),
            escapeFormulas,
          );
        }
      });

      rows.push(row);
    });
  }

  return toTables('ohlc', includeFormattedValues ? FORMATTED_COLUMNS : BASE_COLUMNS, rows);
};
