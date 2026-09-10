import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import { pieExtractor } from './pie';

const createParams = (series: Record<string, any>, overrides: Record<string, any> = {}) =>
  ({
    seriesOrder: Object.keys(series),
    series,
    getXAxis: () => undefined,
    getYAxis: () => undefined,
    getRotationAxis: () => undefined,
    getRadiusAxis: () => undefined,
    options: DEFAULT_CHART_EXCEL_OPTIONS,
    ...overrides,
  }) as any;

describe('pieExtractor', () => {
  it('emits one row per slice, keyed by the slice id and label', () => {
    const [table] = pieExtractor(
      createParams({
        s1: {
          id: 's1',
          data: [
            { id: 'fr', label: 'France', value: 68, formattedValue: '68' },
            { id: 'es', label: 'Spain', value: 47, formattedValue: '47' },
          ],
        },
      }),
    );

    expect(table.id).to.equal('pie');
    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'id',
      'label',
      'value',
    ]);
    expect(table.rows).to.deep.equal([
      { series: 's1', id: 'fr', label: 'France', value: 68 },
      { series: 's1', id: 'es', label: 'Spain', value: 47 },
    ]);
  });

  it('uses the series id, since a pie series carries no label of its own', () => {
    const [table] = pieExtractor(
      createParams({ pie1: { id: 'pie1', data: [{ id: 'a', value: 1 }] } }),
    );

    expect(table.rows[0].series).to.equal('pie1');
  });

  it('resolves a slice label given as a function', () => {
    const [table] = pieExtractor(
      createParams({
        s1: {
          id: 's1',
          data: [{ id: 'a', value: 1, label: (location: string) => `label-${location}` }],
        },
      }),
    );

    expect(table.rows[0].label).to.equal('label-legend');
  });

  it('leaves the label empty when a slice has none', () => {
    const [table] = pieExtractor(createParams({ s1: { id: 's1', data: [{ id: 'a', value: 1 }] } }));

    expect(table.rows[0].label).to.equal(null);
  });

  it('includes slices hidden through the legend by default, dropping them only when asked', () => {
    const series = {
      s1: {
        id: 's1',
        data: [
          { id: 'a', value: 1 },
          { id: 'b', value: 2, hidden: true },
        ],
      },
    };

    expect(pieExtractor(createParams(series))[0].rows.map((row) => row.id)).to.deep.equal([
      'a',
      'b',
    ]);

    const [screenOnly] = pieExtractor(
      createParams(series, {
        options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeHiddenSeries: false },
      }),
    );

    expect(screenOnly.rows.map((row) => row.id)).to.deep.equal(['a']);
  });

  it('reuses the formatted value pie already computed while defaultizing', () => {
    const [table] = pieExtractor(
      createParams(
        { s1: { id: 's1', data: [{ id: 'a', value: 1000, formattedValue: '1 000' }] } },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(table.rows[0].formattedValue).to.equal('1 000');
  });

  it('returns no table when there are no slices', () => {
    expect(pieExtractor(createParams({ s1: { id: 's1', data: [] } }))).to.deep.equal([]);
  });
});
