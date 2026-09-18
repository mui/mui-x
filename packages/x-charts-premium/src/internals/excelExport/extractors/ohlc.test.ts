import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import { ohlcExtractor } from './ohlc';

const axis = (data?: unknown[]) => ({ id: 'a', data }) as any;

const createParams = (series: Record<string, any>, overrides: Record<string, any> = {}) =>
  ({
    seriesOrder: Object.keys(series),
    series,
    getXAxis: () => axis([new Date('2026-01-02T00:00:00Z')]),
    getYAxis: () => undefined,
    getRotationAxis: () => undefined,
    getRadiusAxis: () => undefined,
    options: DEFAULT_CHART_EXCEL_OPTIONS,
    ...overrides,
  }) as any;

describe('ohlcExtractor', () => {
  it('spreads the four measures across four columns on one row', () => {
    const [table] = ohlcExtractor(
      createParams({ s1: { id: 's1', label: 'AAPL', data: [[101, 108, 99, 104]] } }),
    );

    expect(table.id).to.equal('ohlc');
    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'category',
      'open',
      'high',
      'low',
      'close',
    ]);
    expect(table.rows.length).to.equal(1);
    expect(table.rows[0].open).to.equal(101);
    expect(table.rows[0].high).to.equal(108);
    expect(table.rows[0].low).to.equal(99);
    expect(table.rows[0].close).to.equal(104);
  });

  it('has no volume column, because the series carries no volume', () => {
    const [table] = ohlcExtractor(
      createParams({ s1: { id: 's1', label: 'AAPL', data: [[1, 2, 3, 4]] } }),
    );

    expect(table.columns.map((column) => column.key)).to.not.include('volume');
  });

  it('keeps a date category as a Date, so Excel formats it', () => {
    const [table] = ohlcExtractor(
      createParams({ s1: { id: 's1', label: 'AAPL', data: [[1, 2, 3, 4]] } }),
    );

    expect(table.rows[0].category instanceof Date).to.equal(true);
  });

  it('empties all four cells for a null entry', () => {
    const [table] = ohlcExtractor(createParams({ s1: { id: 's1', label: 'AAPL', data: [null] } }));

    expect(table.rows[0].open).to.equal(null);
    expect(table.rows[0].high).to.equal(null);
    expect(table.rows[0].low).to.equal(null);
    expect(table.rows[0].close).to.equal(null);
  });

  it('calls the formatter once per field, since its context names the field', () => {
    const fields: string[] = [];

    const [table] = ohlcExtractor(
      createParams(
        {
          s1: {
            id: 's1',
            label: 'AAPL',
            data: [[101, 108, 99, 104]],
            valueFormatter: (value: number | null, context: { field: string }) => {
              fields.push(context.field);
              return `${context.field}:${value}`;
            },
          },
        },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(fields).to.deep.equal(['open', 'high', 'low', 'close']);
    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'category',
      'open',
      'high',
      'low',
      'close',
      'formattedOpen',
      'formattedHigh',
      'formattedLow',
      'formattedClose',
    ]);
    expect(table.rows[0].formattedOpen).to.equal('open:101');
    expect(table.rows[0].formattedClose).to.equal('close:104');
  });

  it('includes a hidden series by default, and drops it only when asked', () => {
    const series = { s1: { id: 's1', label: 'AAPL', hidden: true, data: [[1, 2, 3, 4]] } };

    expect(ohlcExtractor(createParams(series))[0].rows.length).to.equal(1);
    expect(
      ohlcExtractor(
        createParams(series, {
          options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeHiddenSeries: false },
        }),
      ),
    ).to.deep.equal([]);
  });

  it('returns no table when there are no series', () => {
    expect(ohlcExtractor(createParams({}))).to.deep.equal([]);
  });
});
