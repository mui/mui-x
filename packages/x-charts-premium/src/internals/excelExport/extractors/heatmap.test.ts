import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import { heatmapExtractor } from './heatmap';

const axis = (data?: unknown[]) => ({ id: 'a', data }) as any;

const createParams = (series: Record<string, any>, overrides: Record<string, any> = {}) =>
  ({
    seriesOrder: Object.keys(series),
    series,
    getXAxis: () => axis(['Jan', 'Feb', 'Mar']),
    getYAxis: () => axis(['Monday', 'Tuesday']),
    getRotationAxis: () => undefined,
    getRadiusAxis: () => undefined,
    options: DEFAULT_CHART_EXCEL_OPTIONS,
    ...overrides,
  }) as any;

describe('heatmapExtractor', () => {
  it('resolves both axis indices into their category values', () => {
    const [table] = heatmapExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'Visits',
          data: [
            [0, 0, 4],
            [2, 1, 5],
          ],
        },
      }),
    );

    expect(table.id).to.equal('heatmap');
    expect(table.columns.map((column) => column.key)).to.deep.equal(['series', 'x', 'y', 'value']);
    expect(table.rows).to.deep.equal([
      { series: 'Visits', x: 'Jan', y: 'Monday', value: 4 },
      { series: 'Visits', x: 'Mar', y: 'Tuesday', value: 5 },
    ]);
  });

  it('stays sparse: a cell with no entry produces no row', () => {
    const [table] = heatmapExtractor(
      createParams({ s1: { id: 's1', label: 'Visits', data: [[0, 0, 4]] } }),
    );

    // A dense 3x2 grid would be 6 rows; only the supplied entry is exported.
    expect(table.rows.length).to.equal(1);
  });

  it('falls back to the indices when an axis has no data', () => {
    const [table] = heatmapExtractor(
      createParams(
        { s1: { id: 's1', label: 'Visits', data: [[1, 0, 9]] } },
        { getXAxis: () => axis(undefined), getYAxis: () => axis(undefined) },
      ),
    );

    expect(table.rows[0]).to.deep.equal({ series: 'Visits', x: 1, y: 0, value: 9 });
  });

  it('formats through the axis-index context rather than a data index', () => {
    const [table] = heatmapExtractor(
      createParams(
        {
          s1: {
            id: 's1',
            label: 'Visits',
            data: [[2, 1, 5]],
            valueFormatter: (value: number | null, context: { xIndex: number; yIndex: number }) =>
              `${value} at ${context.xIndex},${context.yIndex}`,
          },
        },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(table.rows[0].formattedValue).to.equal('5 at 2,1');
  });

  it('tolerates a series with no value formatter, which heatmap alone allows', () => {
    const [table] = heatmapExtractor(
      createParams(
        { s1: { id: 's1', label: 'Visits', data: [[0, 0, 4]] } },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(table.rows[0].formattedValue).to.equal(null);
  });

  it('returns no table when there are no cells', () => {
    expect(heatmapExtractor(createParams({ s1: { id: 's1', data: [] } }))).to.deep.equal([]);
  });
});
