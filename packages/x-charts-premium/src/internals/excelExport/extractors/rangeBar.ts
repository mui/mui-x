import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { ChartExcelExtractor } from './types';
import { getCategory, getSeriesLabel, toTables, withFormattedValueColumn } from './utils';

const BASE_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'category', header: 'category' },
  { key: 'start', header: 'start' },
  { key: 'end', header: 'end' },
];

/**
 * Range bar carries `[start, end]` per point. The columns are named start and end rather
 * than min and max on purpose: `RangeBarValueType` gives no ordering guarantee, so a
 * series may legitimately have a start above its end.
 *
 * Its `valueFormatter` receives the whole tuple and returns one string, so there is a
 * single formatted column rather than one per bound.
 */
export const rangeBarExtractor: ChartExcelExtractor<'rangeBar'> = (params) => {
  const { seriesOrder, series, options, getXAxis, getYAxis } = params;
  const { escapeFormulas, includeFormattedValues, includeHiddenSeries } = options;

  const rows: ChartExcelTable['rows'] = [];

  for (const seriesId of seriesOrder) {
    const item = series[seriesId];

    if (!item || (!includeHiddenSeries && item.hidden)) {
      continue;
    }

    const axis = item.layout === 'horizontal' ? getYAxis(item.yAxisId) : getXAxis(item.xAxisId);
    const seriesLabel = getSeriesLabel(item.label, item.id);

    item.data.forEach((value, dataIndex) => {
      const row: ChartExcelTable['rows'][number] = {
        series: toSafeCell(seriesLabel, escapeFormulas),
        category: toSafeCell(getCategory(axis, dataIndex), escapeFormulas),
        start: toCell(value?.[0]),
        end: toCell(value?.[1]),
      };

      if (includeFormattedValues) {
        row.formattedValue = toSafeCell(
          item.valueFormatter?.(value, { dataIndex }),
          escapeFormulas,
        );
      }

      rows.push(row);
    });
  }

  const columns = includeFormattedValues
    ? withFormattedValueColumn(BASE_COLUMNS, 'end')
    : BASE_COLUMNS;

  return toTables('rangeBar', columns, rows);
};
