import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import { scatterExtractor } from './scatter';

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

describe('scatterExtractor', () => {
  it('emits a row per point, with no category column', () => {
    const [table] = scatterExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'A',
          data: [
            { x: 1.2, y: 4.5, id: 'p1' },
            { x: 3.4, y: 2.2, id: 'p2' },
          ],
        },
      }),
    );

    expect(table.id).to.equal('scatter');
    expect(table.columns.map((column) => column.key)).to.deep.equal(['series', 'id', 'x', 'y']);
    expect(table.rows).to.deep.equal([
      { series: 'A', id: 'p1', x: 1.2, y: 4.5 },
      { series: 'A', id: 'p2', x: 3.4, y: 2.2 },
    ]);
  });

  it('leaves the point id empty when the user supplied none', () => {
    const [table] = scatterExtractor(
      createParams({ s1: { id: 's1', label: 'A', data: [{ x: 1, y: 2 }] } }),
    );

    expect(table.rows[0].id).to.equal(null);
  });

  it('keeps two series in one table without aligning them', () => {
    // Scatter is not index aligned, so unequal lengths are not padded.
    const [table] = scatterExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'A',
          data: [
            { x: 1, y: 1 },
            { x: 2, y: 2 },
          ],
        },
        s2: { id: 's2', label: 'B', data: [{ x: 9, y: 9 }] },
      }),
    );

    expect(table.rows.map((row) => row.series)).to.deep.equal(['A', 'A', 'B']);
  });

  it('omits the channel columns when no point defines them', () => {
    const [table] = scatterExtractor(
      createParams({ s1: { id: 's1', label: 'A', data: [{ x: 1, y: 2 }] } }),
    );

    expect(table.columns.map((column) => column.key)).to.not.include('colorValue');
    expect(table.columns.map((column) => column.key)).to.not.include('sizeValue');
  });

  it('adds a channel column when at least one point across the chart defines it', () => {
    const [table] = scatterExtractor(
      createParams({
        s1: { id: 's1', label: 'A', data: [{ x: 1, y: 2 }] },
        s2: { id: 's2', label: 'B', data: [{ x: 3, y: 4, colorValue: 7 }] },
      }),
    );

    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'id',
      'x',
      'y',
      'colorValue',
    ]);
    expect(table.rows[0].colorValue).to.equal(null);
    expect(table.rows[1].colorValue).to.equal(7);
  });

  it('ignores the deprecated z channel', () => {
    const [table] = scatterExtractor(
      createParams({ s1: { id: 's1', label: 'A', data: [{ x: 1, y: 2, z: 5 }] } }),
    );

    expect(table.columns.map((column) => column.key)).to.not.include('z');
  });

  it('includes hidden series by default, and drops them only when asked', () => {
    const series = {
      s1: { id: 's1', label: 'A', data: [{ x: 1, y: 2 }] },
      s2: { id: 's2', label: 'B', hidden: true, data: [{ x: 3, y: 4 }] },
    };

    expect(scatterExtractor(createParams(series))[0].rows.map((row) => row.series)).to.deep.equal([
      'A',
      'B',
    ]);

    const [screenOnly] = scatterExtractor(
      createParams(series, {
        options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeHiddenSeries: false },
      }),
    );

    expect(screenOnly.rows.map((row) => row.series)).to.deep.equal(['A']);
  });

  it('ignores a hidden series when deciding which channel columns to add', () => {
    const [screenOnly] = scatterExtractor(
      createParams(
        {
          s1: { id: 's1', label: 'A', data: [{ x: 1, y: 2 }] },
          s2: { id: 's2', label: 'B', hidden: true, data: [{ x: 3, y: 4, colorValue: 7 }] },
        },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeHiddenSeries: false } },
      ),
    );

    expect(screenOnly.columns.map((column) => column.key)).to.not.include('colorValue');
  });

  it('formats the whole point into a single column', () => {
    const [table] = scatterExtractor(
      createParams(
        {
          s1: {
            id: 's1',
            label: 'A',
            data: [{ x: 1, y: 2 }],
            valueFormatter: (point: { x: number; y: number }) => `(${point.x}, ${point.y})`,
          },
        },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'id',
      'x',
      'y',
      'formattedValue',
    ]);
    expect(table.rows[0].formattedValue).to.equal('(1, 2)');
  });

  it('returns no table when nothing is visible', () => {
    expect(scatterExtractor(createParams({}))).to.deep.equal([]);
  });
});
