import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import {
  barExtractor,
  lineExtractor,
  radarExtractor,
  radialBarExtractor,
  radialLineExtractor,
} from './categoryValue';

const axis = (data?: unknown[]) => ({ id: 'a', data }) as any;

const createParams = (series: Record<string, any>, overrides: Record<string, any> = {}) =>
  ({
    seriesOrder: Object.keys(series),
    series,
    getXAxis: () => axis(['France', 'Spain']),
    getYAxis: () => axis(['France', 'Spain']),
    getRotationAxis: () => axis(['Speed', 'Range']),
    getRadiusAxis: () => undefined,
    options: DEFAULT_CHART_EXCEL_OPTIONS,
    ...overrides,
  }) as any;

describe('barExtractor', () => {
  it('emits one row per data point into the shared category table', () => {
    const [table] = barExtractor(
      createParams({
        s1: { id: 's1', label: 'Sales', data: [68, 47] },
      }),
    );

    expect(table.id).to.equal('category');
    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'category',
      'value',
    ]);
    expect(table.rows).to.deep.equal([
      { series: 'Sales', category: 'France', value: 68 },
      { series: 'Sales', category: 'Spain', value: 47 },
    ]);
  });

  it('reads the category off the y axis when laid out horizontally', () => {
    const [table] = barExtractor(
      createParams(
        { s1: { id: 's1', label: 'Sales', layout: 'horizontal', data: [1] } },
        {
          getXAxis: () => axis(['wrong']),
          getYAxis: () => axis(['right']),
        },
      ),
    );

    expect(table.rows[0].category).to.equal('right');
  });

  it('falls back to the data index when the axis has no data', () => {
    // Happens only when no data, dataKey or valueGetter was given, and there the index
    // is the coordinate the point is plotted at.
    const [table] = barExtractor(
      createParams(
        { s1: { id: 's1', label: 'Sales', data: [10, 20] } },
        { getXAxis: () => axis(undefined) },
      ),
    );

    expect(table.rows.map((row) => row.category)).to.deep.equal([0, 1]);
  });

  it('falls back to the series id when there is no label', () => {
    const [table] = barExtractor(createParams({ s1: { id: 's1', data: [1] } }));

    expect(table.rows[0].series).to.equal('s1');
  });

  it('keeps null data points as empty cells', () => {
    const [table] = barExtractor(
      createParams({ s1: { id: 's1', label: 'Sales', data: [1, null] } }),
    );

    expect(table.rows.map((row) => row.value)).to.deep.equal([1, null]);
  });

  it('includes hidden series by default, and drops them only when asked', () => {
    const series = {
      s1: { id: 's1', label: 'Visible', data: [1] },
      s2: { id: 's2', label: 'Hidden', hidden: true, data: [2] },
    };

    const [byDefault] = barExtractor(createParams(series));

    expect(byDefault.rows.map((row) => row.series)).to.deep.equal(['Visible', 'Hidden']);

    const [screenOnly] = barExtractor(
      createParams(series, {
        options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeHiddenSeries: false },
      }),
    );

    expect(screenOnly.rows.map((row) => row.series)).to.deep.equal(['Visible']);
  });

  it('exports the raw value of a stacked series, not its stacked bounds', () => {
    const [table] = barExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'Sales',
          data: [3],
          stackedData: [[10, 13]],
          visibleStackedData: [[10, 13]],
        },
      }),
    );

    expect(table.rows[0].value).to.equal(3);
  });

  it('adds a formatted column only when asked', () => {
    const series = {
      s1: {
        id: 's1',
        label: 'Sales',
        data: [1000],
        valueFormatter: (value: number | null) => `${value} EUR`,
      },
    };

    const [without] = barExtractor(createParams(series));

    expect(without.rows[0]).to.not.have.property('formattedValue');

    const [withFormatted] = barExtractor(
      createParams(series, {
        options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true },
      }),
    );

    expect(withFormatted.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'category',
      'value',
      'formattedValue',
    ]);
    expect(withFormatted.rows[0].formattedValue).to.equal('1000 EUR');
  });

  it('returns no table when there is nothing to export', () => {
    expect(barExtractor(createParams({}))).to.deep.equal([]);
    expect(
      barExtractor(
        createParams(
          { s1: { id: 's1', hidden: true, data: [1] } },
          { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeHiddenSeries: false } },
        ),
      ),
    ).to.deep.equal([]);
  });
});

describe('lineExtractor', () => {
  it('reads the category off the x axis', () => {
    const [table] = lineExtractor(createParams({ s1: { id: 's1', label: 'Temp', data: [20.1] } }));

    expect(table.rows).to.deep.equal([{ series: 'Temp', category: 'France', value: 20.1 }]);
  });
});

describe('radarExtractor', () => {
  it('uses the default rotation axis, since a radar series names none', () => {
    const [table] = radarExtractor(
      createParams({ s1: { id: 's1', label: 'Car A', data: [8, 3] } }),
    );

    expect(table.rows.map((row) => row.category)).to.deep.equal(['Speed', 'Range']);
  });
});

describe('radialLineExtractor and radialBarExtractor', () => {
  it('read the category off the rotation axis the series names', () => {
    const params = createParams(
      { s1: { id: 's1', label: 'S', rotationAxisId: 'r2', data: [5] } },
      { getRotationAxis: (id: string) => axis([id === 'r2' ? 'right' : 'wrong']) },
    );

    expect(radialLineExtractor(params)[0].rows[0].category).to.equal('right');
    expect(radialBarExtractor(params)[0].rows[0].category).to.equal('right');
  });
});
