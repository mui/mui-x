import { describe, expect, it } from 'vitest';
import { DEFAULT_CHART_EXCEL_OPTIONS } from '../chartExcelData.types';
import { funnelExtractor } from './funnel';

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

describe('funnelExtractor', () => {
  it('emits one row per section, in stage order', () => {
    const [table] = funnelExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'Signups',
          data: [
            { id: 'visits', label: 'Visits', value: 1000 },
            { id: 'trials', label: 'Trials', value: 250 },
          ],
        },
      }),
    );

    expect(table.id).to.equal('funnel');
    expect(table.columns.map((column) => column.key)).to.deep.equal([
      'series',
      'id',
      'label',
      'value',
    ]);
    expect(table.rows).to.deep.equal([
      { series: 'Signups', id: 'visits', label: 'Visits', value: 1000 },
      { series: 'Signups', id: 'trials', label: 'Trials', value: 250 },
    ]);
  });

  it('excludes the polygon geometry the series carries alongside the data', () => {
    const [table] = funnelExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'S',
          data: [{ id: 'a', value: 1 }],
          dataPoints: [[{ x: 0, y: 0, useBandWidth: false, stackOffset: 0 }]],
        },
      }),
    );

    expect(table.columns.map((column) => column.key)).to.not.include('dataPoints');
    expect(table.rows[0]).to.deep.equal({ series: 'S', id: 'a', label: null, value: 1 });
  });

  it('resolves a section label given as a function', () => {
    const [table] = funnelExtractor(
      createParams({
        s1: {
          id: 's1',
          label: 'S',
          data: [{ id: 'a', value: 1, label: (location: string) => `label-${location}` }],
        },
      }),
    );

    expect(table.rows[0].label).to.equal('label-legend');
  });

  it('formats the section value when asked', () => {
    const [table] = funnelExtractor(
      createParams(
        {
          s1: {
            id: 's1',
            label: 'S',
            data: [{ id: 'a', value: 1000 }],
            valueFormatter: (section: { value: number }) => `${section.value} users`,
          },
        },
        { options: { ...DEFAULT_CHART_EXCEL_OPTIONS, includeFormattedValues: true } },
      ),
    );

    expect(table.rows[0].formattedValue).to.equal('1000 users');
  });

  it('returns no table when there are no sections', () => {
    expect(funnelExtractor(createParams({}))).to.deep.equal([]);
  });
});
