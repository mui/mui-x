import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { ChartExcelExtractor } from './types';
import { getCategory, getSeriesLabel, toTables, withFormattedValueColumn } from './utils';

const BASE_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'x', header: 'x' },
  { key: 'y', header: 'y' },
  { key: 'value', header: 'value' },
];

/**
 * Heatmap data is sparse `[xIndex, yIndex, value]` tuples against two axes. The export
 * stays sparse: one row per entry the user supplied, so a cell with no data has no row
 * rather than a `null` one. Its `valueFormatter` is the only one keyed by axis indices
 * instead of a data index, and the only one that is optional after defaultizing.
 */
export const heatmapExtractor: ChartExcelExtractor<'heatmap'> = (params) => {
  const { seriesOrder, series, options, getXAxis, getYAxis } = params;
  const { escapeFormulas, includeFormattedValues } = options;

  const rows: ChartExcelTable['rows'] = [];

  for (const seriesId of seriesOrder) {
    const item = series[seriesId];

    // Heatmap carries no `hidden` flag, at series or at cell level.
    if (!item) {
      continue;
    }

    const xAxis = getXAxis(item.xAxisId);
    const yAxis = getYAxis(item.yAxisId);
    const seriesLabel = getSeriesLabel(item.label, item.id);

    for (const [xIndex, yIndex, value] of item.data) {
      const row: ChartExcelTable['rows'][number] = {
        series: toSafeCell(seriesLabel, escapeFormulas),
        x: toSafeCell(getCategory(xAxis, xIndex), escapeFormulas),
        y: toSafeCell(getCategory(yAxis, yIndex), escapeFormulas),
        value: toCell(value),
      };

      if (includeFormattedValues) {
        row.formattedValue = toSafeCell(
          item.valueFormatter?.(value, { xIndex, yIndex }),
          escapeFormulas,
        );
      }

      rows.push(row);
    }
  }

  const columns = includeFormattedValues
    ? withFormattedValueColumn(BASE_COLUMNS, 'value')
    : BASE_COLUMNS;

  return toTables('heatmap', columns, rows);
};
