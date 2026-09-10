import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import { sankeyExtractor } from './sankey';

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

/** d3-sankey replaces the link source and target ids with node references. */
const createGraph = () => {
  const coal = { id: 'coal', label: 'Coal', value: 42 };
  const power = { id: 'power', label: 'Power', value: 42 };

  return {
    nodes: [coal, power],
    links: [{ source: coal, target: power, value: 42 }],
  };
};

describe('sankeyExtractor', () => {
  it('emits two tables, since a graph has no one-row-per-point form', () => {
    const tables = sankeyExtractor(createParams({ s1: { id: 's1', data: createGraph() } }));

    expect(tables.map((table) => table.id)).to.deep.equal(['sankeyNodes', 'sankeyLinks']);
  });

  it('lists the nodes with their id, label and computed total', () => {
    const [nodes] = sankeyExtractor(createParams({ s1: { id: 's1', data: createGraph() } }));

    expect(nodes.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'id',
      'label',
      'value',
    ]);
    expect(nodes.rows).to.deep.equal([
      { series: 's1', id: 'coal', label: 'Coal', value: 42 },
      { series: 's1', id: 'power', label: 'Power', value: 42 },
    ]);
  });

  it('reads the link endpoints back off the node objects', () => {
    // After defaultizing, `source` and `target` are nodes, not the ids the user passed.
    const [, links] = sankeyExtractor(createParams({ s1: { id: 's1', data: createGraph() } }));

    expect(links.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'source',
      'target',
      'value',
    ]);
    expect(links.rows).to.deep.equal([
      { series: 's1', source: 'coal', target: 'power', value: 42 },
    ]);
  });

  it('always labels rows with the series id, since a sankey series has no label prop', () => {
    const [nodes] = sankeyExtractor(createParams({ flow: { id: 'flow', data: createGraph() } }));

    expect(nodes.rows[0].series).to.equal('flow');
  });

  it('formats nodes and links through their own context shapes', () => {
    const contexts: any[] = [];

    const [nodes, links] = sankeyExtractor(
      createParams(
        {
          s1: {
            id: 's1',
            data: createGraph(),
            valueFormatter: (value: number, context: any) => {
              contexts.push(context);
              return `${context.type}:${value}`;
            },
          },
        },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(nodes.rows[0].formattedValue).to.equal('node:42');
    expect(links.rows[0].formattedValue).to.equal('link:42');
    expect(contexts[0]).to.deep.equal({ location: 'tooltip', type: 'node', nodeId: 'coal' });
    expect(contexts[2]).to.deep.equal({
      location: 'tooltip',
      type: 'link',
      sourceId: 'coal',
      targetId: 'power',
    });
  });

  it('emits only the table that has rows', () => {
    const tables = sankeyExtractor(
      createParams({
        s1: { id: 's1', data: { nodes: [{ id: 'a', label: 'A', value: 0 }], links: [] } },
      }),
    );

    expect(tables.map((table) => table.id)).to.deep.equal(['sankeyNodes']);
  });

  it('returns nothing for an empty graph', () => {
    expect(
      sankeyExtractor(createParams({ s1: { id: 's1', data: { nodes: [], links: [] } } })),
    ).to.deep.equal([]);
  });
});
