import type { AxisId, ComputedAxis } from '@mui/x-charts/internals';
import type { SeriesId } from '@mui/x-charts/models';
import type { ChartExcelColumn, ChartExcelTable } from '../chartExcelData.types';
import { toCell, toSafeCell } from '../cell';
import type { ChartExcelExtractor, ChartExcelExtractorParams } from './types';
import { getCategory, getSeriesLabel, toTables, withFormattedValueColumn } from './utils';

/**
 * The single-measure, index-aligned series: bar, line, radar, radialLine and radialBar.
 * They differ only in which axis supplies the category, so they share one implementation
 * and one `category` table.
 */
interface CategorySeriesShape {
  id: SeriesId;
  label?: string | ((location: 'tooltip' | 'legend') => string | undefined);
  hidden?: boolean;
  layout?: 'vertical' | 'horizontal';
  xAxisId?: AxisId;
  yAxisId?: AxisId;
  rotationAxisId?: AxisId;
  data: readonly (number | null)[];
  valueFormatter?: (value: number | null, context: { dataIndex: number }) => string | null;
}

type ResolveAxis = (
  series: CategorySeriesShape,
  params: ChartExcelExtractorParams<never>,
) => ComputedAxis | undefined;

const BASE_COLUMNS: ChartExcelColumn[] = [
  { key: 'series', header: 'series' },
  { key: 'category', header: 'category' },
  { key: 'value', header: 'value' },
];

function createCategoryValueExtractor(resolveAxis: ResolveAxis) {
  return (params: ChartExcelExtractorParams<never>): ChartExcelTable[] => {
    const { seriesOrder, series, options } = params;
    const { escapeFormulas, includeFormattedValues, includeHiddenSeries } = options;

    const rows: ChartExcelTable['rows'] = [];

    for (const seriesId of seriesOrder) {
      const item = series[seriesId] as unknown as CategorySeriesShape | undefined;

      if (!item || (!includeHiddenSeries && item.hidden)) {
        continue;
      }

      const axis = resolveAxis(item, params);
      const seriesLabel = getSeriesLabel(item.label, item.id);

      item.data.forEach((value, dataIndex) => {
        const row: ChartExcelTable['rows'][number] = {
          series: toSafeCell(seriesLabel, escapeFormulas),
          category: toSafeCell(getCategory(axis, dataIndex), escapeFormulas),
          // Raw value, never `stackedData`: the export reports what the user supplied.
          value: toCell(value),
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
      ? withFormattedValueColumn(BASE_COLUMNS, 'value')
      : BASE_COLUMNS;

    return toTables('category', columns, rows);
  };
}

/** Bar plots its category on the y axis when laid out horizontally. */
export const barExtractor = createCategoryValueExtractor((series, params) =>
  series.layout === 'horizontal'
    ? params.getYAxis(series.yAxisId)
    : params.getXAxis(series.xAxisId),
) as ChartExcelExtractor<'bar'>;

export const lineExtractor = createCategoryValueExtractor((series, params) =>
  params.getXAxis(series.xAxisId),
) as ChartExcelExtractor<'line'>;

/** Radar has no `rotationAxisId`, so it always uses the chart's default rotation axis. */
export const radarExtractor = createCategoryValueExtractor((_series, params) =>
  params.getRotationAxis(),
) as ChartExcelExtractor<'radar'>;

export const radialLineExtractor = createCategoryValueExtractor((series, params) =>
  params.getRotationAxis(series.rotationAxisId),
) as ChartExcelExtractor<'radialLine'>;

export const radialBarExtractor = createCategoryValueExtractor((series, params) =>
  params.getRotationAxis(series.rotationAxisId),
) as ChartExcelExtractor<'radialBar'>;
