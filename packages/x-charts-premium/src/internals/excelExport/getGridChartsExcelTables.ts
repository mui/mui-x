import type { ChartExcelColumn, ChartExcelTable } from './chartExcelData.types';
import { toCell, toSafeCell } from './cell';
import { DEFAULT_CHART_EXCEL_OPTIONS } from './defaults';

export interface GridChartsExcelSeries {
  id: string;
  label: string;
  data: readonly (number | null)[];
}

export interface GridChartsExcelDimension {
  id: string;
  label: string;
  data: readonly (string | number | Date | null)[];
}

export interface GetGridChartsExcelTablesOptions {
  /**
   * If `true`, text cells Excel would evaluate as formulas are escaped.
   * @default true
   */
  escapeFormulas?: boolean;
}

/** Keeps a header usable when two grid columns carry the same label. */
function toUniqueKeys(dimensions: readonly GridChartsExcelDimension[]): string[] {
  return dimensions.map((dimension, index) => `dimension${index}`);
}

/**
 * Serializes the Data Grid integration's selection, rather than the rendered chart.
 *
 * The renderer joins several dimensions into one axis label, for instance `France - Paris`,
 * and appends an occurrence count to repeated categories. Neither belongs in a spreadsheet,
 * so each dimension keeps its own column here and values are written untouched.
 */
export function getGridChartsExcelTables(
  dimensions: readonly GridChartsExcelDimension[],
  values: readonly GridChartsExcelSeries[],
  options: GetGridChartsExcelTablesOptions = {},
): ChartExcelTable[] {
  const { escapeFormulas = DEFAULT_CHART_EXCEL_OPTIONS.escapeFormulas } = options;

  if (values.length === 0) {
    return [];
  }

  const dimensionKeys = toUniqueKeys(dimensions);

  const columns: ChartExcelColumn[] = [
    ...dimensions.map((dimension, index) => ({
      key: dimensionKeys[index],
      header: dimension.label,
    })),
    { key: 'series', header: 'series' },
    { key: 'value', header: 'value' },
  ];

  // The grid pads every selection to the same length, so the longest series covers them all.
  const rowCount = Math.max(
    ...values.map((value) => value.data.length),
    ...dimensions.map((dimension) => dimension.data.length),
    0,
  );

  const rows: ChartExcelTable['rows'] = [];

  for (const value of values) {
    for (let dataIndex = 0; dataIndex < rowCount; dataIndex += 1) {
      const row: ChartExcelTable['rows'][number] = {
        series: toSafeCell(value.label, escapeFormulas),
        value: toCell(value.data[dataIndex]),
      };

      dimensions.forEach((dimension, index) => {
        row[dimensionKeys[index]] = toSafeCell(dimension.data[dataIndex], escapeFormulas);
      });

      rows.push(row);
    }
  }

  if (rows.length === 0) {
    return [];
  }

  return [{ id: 'gridCharts', columns, rows }];
}
