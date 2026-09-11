import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { ChartExcelExtractor } from './types';
import { getSeriesLabel, toTables, withFormattedValueColumn } from './utils';

/**
 * Scatter is the only cartesian series that is not indexed against its axis: each point
 * carries its own coordinates, so there is no category column and no alignment between
 * series. `colorValue` and `sizeValue` are optional channels, so their columns appear only
 * when at least one point actually defines them, rather than sitting empty on every chart.
 */
export const scatterExtractor: ChartExcelExtractor<'scatter'> = (params) => {
  const { seriesOrder, series, options } = params;
  const { escapeFormulas, includeFormattedValues, includeHiddenSeries } = options;

  const visibleSeries = seriesOrder
    .map((seriesId) => series[seriesId])
    .filter((item) => item && (includeHiddenSeries || !item.hidden));

  let hasColorValue = false;
  let hasSizeValue = false;

  for (const item of visibleSeries) {
    for (const point of item.data) {
      hasColorValue ||= point.colorValue !== undefined;
      hasSizeValue ||= point.sizeValue !== undefined;
    }
  }

  const rows: ChartExcelTable['rows'] = [];

  for (const item of visibleSeries) {
    const seriesLabel = getSeriesLabel(item.label, item.id);

    item.data.forEach((point, dataIndex) => {
      const row: ChartExcelTable['rows'][number] = {
        series: toSafeCell(seriesLabel, escapeFormulas),
        id: toSafeCell(point.id, escapeFormulas),
        x: toCell(point.x),
        y: toCell(point.y),
      };

      if (hasColorValue) {
        row.colorValue = toSafeCell(point.colorValue, escapeFormulas);
      }
      if (hasSizeValue) {
        row.sizeValue = toSafeCell(point.sizeValue, escapeFormulas);
      }
      if (includeFormattedValues) {
        // The scatter formatter receives the whole point and returns one string.
        row.formattedValue = toSafeCell(
          item.valueFormatter?.(point, { dataIndex }),
          escapeFormulas,
        );
      }

      rows.push(row);
    });
  }

  let columns: ChartExcelColumn[] = [
    { key: 'series', header: 'series' },
    { key: 'id', header: 'id' },
    { key: 'x', header: 'x' },
    { key: 'y', header: 'y' },
  ];

  if (hasColorValue) {
    columns.push({ key: 'colorValue', header: 'colorValue' });
  }
  if (hasSizeValue) {
    columns.push({ key: 'sizeValue', header: 'sizeValue' });
  }
  if (includeFormattedValues) {
    columns = withFormattedValueColumn(columns, 'y');
  }

  return toTables('scatter', columns, rows);
};
