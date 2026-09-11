import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { ChartExcelExtractor } from './types';
import { getSeriesLabel, toTables, withFormattedValueColumn } from './utils';

const BASE_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'name', header: 'name' },
  { key: 'label', header: 'label' },
  { key: 'value', header: 'value' },
  { key: 'colorValue', header: 'colorValue' },
];

/**
 * Map shape entries are joined to GeoJSON features by `name`, not by an index, so the
 * name is the identity. `value` is genuinely optional, so a feature present in the data
 * with no number still produces a row with an empty value cell. Visibility is per item.
 */
export const mapShapeExtractor: ChartExcelExtractor<'mapShape'> = (params) => {
  const { seriesOrder, series, options } = params;
  const { escapeFormulas, includeFormattedValues, includeHiddenSeries } = options;

  const rows: ChartExcelTable['rows'] = [];

  for (const seriesId of seriesOrder) {
    const item = series[seriesId];

    if (!item || (!includeHiddenSeries && item.hidden)) {
      continue;
    }

    const seriesLabel = getSeriesLabel(item.label, item.id);

    item.data.forEach((shape, dataIndex) => {
      if (!includeHiddenSeries && shape.hidden) {
        return;
      }

      const row: ChartExcelTable['rows'][number] = {
        series: toSafeCell(seriesLabel, escapeFormulas),
        name: toSafeCell(shape.name, escapeFormulas),
        label: toSafeCell(shape.label, escapeFormulas),
        value: toCell(shape.value),
        colorValue: toSafeCell(shape.colorValue, escapeFormulas),
      };

      if (includeFormattedValues) {
        row.formattedValue = toSafeCell(
          item.valueFormatter?.(shape, { dataIndex }),
          escapeFormulas,
        );
      }

      rows.push(row);
    });
  }

  const columns = includeFormattedValues
    ? withFormattedValueColumn(BASE_COLUMNS, 'value')
    : BASE_COLUMNS;

  return toTables('mapShape', columns, rows);
};
