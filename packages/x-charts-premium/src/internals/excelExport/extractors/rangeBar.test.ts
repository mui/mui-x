import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import { rangeBarExtractor } from './rangeBar';

const axis = (data?: unknown[]) => ({ id: 'a', data }) as any;

const createParams = (series: Record<string, any>, overrides: Record<string, any> = {}) =>
  ({
    seriesOrder: Object.keys(series),
    series,
    getXAxis: () => axis(['Jan', 'Feb']),
    getYAxis: () => axis(['Jan', 'Feb']),
    getRotationAxis: () => undefined,
    getRadiusAxis: () => undefined,
    options: DEFAULT_CHART_EXCEL_OPTIONS,
    ...overrides,
  }) as any;

describe('rangeBarExtractor', () => {
  it('splits the pair into start and end columns', () => {
    const [table] = rangeBarExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'Temp',
          data: [
            [4, 12],
            [1, 9],
          ],
        },
      }),
    );

    expect(table.id).to.equal('rangeBar');
    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'category',
      'start',
      'end',
    ]);
    expect(table.rows).to.deep.equal([
      { series: 'Temp', category: 'Jan', start: 4, end: 12 },
      { series: 'Temp', category: 'Feb', start: 1, end: 9 },
    ]);
  });

  it('does not reorder a pair whose start is above its end', () => {
    // RangeBarValueType guarantees no ordering, so these are start and end, not min and max.
    const [table] = rangeBarExtractor(
      createParams({ s1: { id: 's1', label: 'T', data: [[12, 4]] } }),
    );

    expect(table.rows[0].start).to.equal(12);
    expect(table.rows[0].end).to.equal(4);
  });

  it('empties both cells for a null entry', () => {
    const [table] = rangeBarExtractor(createParams({ s1: { id: 's1', label: 'T', data: [null] } }));

    expect(table.rows[0].start).to.equal(null);
    expect(table.rows[0].end).to.equal(null);
  });

  it('reads the category off the y axis when laid out horizontally', () => {
    const [table] = rangeBarExtractor(
      createParams(
        { s1: { id: 's1', label: 'T', layout: 'horizontal', data: [[1, 2]] } },
        { getXAxis: () => axis(['wrong']), getYAxis: () => axis(['right']) },
      ),
    );

    expect(table.rows[0].category).to.equal('right');
  });

  it('formats the whole pair into one column', () => {
    const [table] = rangeBarExtractor(
      createParams(
        {
          s1: {
            id: 's1',
            label: 'T',
            data: [[4, 12]],
            valueFormatter: (value: [number, number] | null) =>
              value === null ? '' : `${value[0]} to ${value[1]}`,
          },
        },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'category',
      'start',
      'end',
      'formattedValue',
    ]);
    expect(table.rows[0].formattedValue).to.equal('4 to 12');
  });

  it('includes hidden series by default, and drops them only when asked', () => {
    const series = { s1: { id: 's1', label: 'T', hidden: true, data: [[1, 2]] } };

    expect(rangeBarExtractor(createParams(series))[0].rows.length).to.equal(1);
    expect(
      rangeBarExtractor(
        createParams(series, {
          options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeHiddenSeries: false },
        }),
      ),
    ).to.deep.equal([]);
  });
});
