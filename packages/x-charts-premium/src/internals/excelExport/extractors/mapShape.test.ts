import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import { mapShapeExtractor } from './mapShape';

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

describe('mapShapeExtractor', () => {
  it('keys each row by the feature name rather than an index', () => {
    const [table] = mapShapeExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'Population',
          data: [
            { name: 'FR-75', label: 'Paris', value: 2100000 },
            { name: 'FR-69', label: 'Rhone', value: 1800000 },
          ],
        },
      }),
    );

    expect(table.id).to.equal('mapShape');
    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'name',
      'label',
      'value',
      'colorValue',
    ]);
    expect(table.rows[0].name).to.equal('FR-75');
    expect(table.rows[0].label).to.equal('Paris');
    expect(table.rows[0].value).to.equal(2100000);
  });

  it('keeps a feature that has no value, since a blank region is meaningful on a map', () => {
    const [table] = mapShapeExtractor(
      createParams({ s1: { id: 's1', label: 'P', data: [{ name: 'FR-75' }] } }),
    );

    expect(table.rows.length).to.equal(1);
    expect(table.rows[0].value).to.equal(null);
  });

  it('includes items hidden through the legend by default, dropping them only when asked', () => {
    const series = {
      s1: {
        id: 's1',
        label: 'P',
        data: [
          { name: 'a', value: 1 },
          { name: 'b', value: 2, hidden: true },
        ],
      },
    };

    expect(mapShapeExtractor(createParams(series))[0].rows.map((row) => row.name)).to.deep.equal([
      'a',
      'b',
    ]);

    const [screenOnly] = mapShapeExtractor(
      createParams(series, {
        options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeHiddenSeries: false },
      }),
    );

    expect(screenOnly.rows.map((row) => row.name)).to.deep.equal(['a']);
  });

  it('formats the whole entry into one column', () => {
    const [table] = mapShapeExtractor(
      createParams(
        {
          s1: {
            id: 's1',
            label: 'P',
            data: [{ name: 'FR-75', value: 2100000 }],
            valueFormatter: (shape: { value?: number }) => `${shape.value} people`,
          },
        },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(table.rows[0].formattedValue).to.equal('2100000 people');
  });

  it('returns no table when nothing is visible', () => {
    expect(mapShapeExtractor(createParams({}))).to.deep.equal([]);
  });
});
