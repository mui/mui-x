import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from './chartExcelData.types';
import { collectChartExcelTables } from './getChartExcelTables';

const axis = (data?: unknown[]) => ({ id: 'a', data }) as any;

const collect = (processedSeries: Record<string, any>) =>
  collectChartExcelTables({
    processedSeries: processedSeries as any,
    getXAxis: () => axis(['France', 'Spain']),
    getYAxis: () => axis(['France', 'Spain']),
    getRotationAxis: () => undefined,
    getRadiusAxis: () => undefined,
    options: DEFAULT_CHART_EXCEL_OPTIONS,
  });

const group = (series: Record<string, any>) => ({
  seriesOrder: Object.keys(series),
  series,
});

describe('collectChartExcelTables', () => {
  it('merges series types that share a column signature into one table', () => {
    const tables = collect({
      bar: group({ b1: { id: 'b1', label: 'Sales', data: [68, 47] } }),
      line: group({ l1: { id: 'l1', label: 'Trend', data: [60, 50] } }),
    });

    expect(tables.length).to.equal(1);
    expect(tables[0].id).to.equal('category');
    expect(tables[0].rows.map((row) => row.series)).to.deep.equal([
      'Sales',
      'Sales',
      'Trend',
      'Trend',
    ]);
  });

  it('keeps series types with different signatures in separate tables', () => {
    const tables = collect({
      bar: group({ b1: { id: 'b1', label: 'Sales', data: [1] } }),
      scatter: group({ s1: { id: 's1', label: 'Points', data: [{ x: 1, y: 2 }] } }),
    });

    expect(tables.map((table) => table.id)).to.deep.equal(['category', 'scatter']);
  });

  it('does not mutate the table a single extractor returned when merging', () => {
    const tables = collect({
      bar: group({ b1: { id: 'b1', label: 'A', data: [1] } }),
      line: group({ l1: { id: 'l1', label: 'B', data: [2] } }),
    });
    const merged = tables[0];

    // Merging twice from the same module-level column arrays must not accumulate rows.
    const again = collect({
      bar: group({ b1: { id: 'b1', label: 'A', data: [1] } }),
    });

    expect(merged.rows.length).to.equal(2);
    expect(again[0].rows.length).to.equal(1);
  });

  it('lets one series type contribute several tables', () => {
    const coal = { id: 'coal', label: 'Coal', value: 42 };
    const power = { id: 'power', label: 'Power', value: 42 };

    const tables = collect({
      sankey: group({
        s1: {
          id: 's1',
          data: { nodes: [coal, power], links: [{ source: coal, target: power, value: 42 }] },
        },
      }),
    });

    expect(tables.map((table) => table.id)).to.deep.equal(['sankeyNodes', 'sankeyLinks']);
  });

  it('returns nothing for a chart with no series', () => {
    expect(collect({})).to.deep.equal([]);
  });

  it('still exports a chart whose every series is hidden', () => {
    // Hidden series are included by default, so this is a table rather than nothing.
    const tables = collect({
      bar: group({ b1: { id: 'b1', label: 'A', hidden: true, data: [1] } }),
    });

    expect(tables.length).to.equal(1);
    expect(tables[0].rows.length).to.equal(1);
  });

  it('ignores a series type that has no extractor', () => {
    expect(collect({ somethingElse: group({ x: { id: 'x', data: [1] } }) })).to.deep.equal([]);
  });
});
