import { identifierCleanerSeriesIdDataIndex } from './identifierCleaner';

describe('identifierCleanerSeriesIdDataIndex', () => {
  test.for([
    [
      'bar',
      { type: 'bar', seriesId: 's1', dataIndex: 0, extra: 'remove me' },
      { type: 'bar', seriesId: 's1', dataIndex: 0 },
    ],
    [
      'line',
      { type: 'line', seriesId: 's2', foo: 'bar' },
      { type: 'line', seriesId: 's2', dataIndex: undefined },
    ],
    [
      'funnel',
      { type: 'funnel', seriesId: 's3', dataIndex: 2, baz: 42 },
      { type: 'funnel', seriesId: 's3', dataIndex: 2 },
    ],
    [
      'heatmap',
      { type: 'heatmap', seriesId: 's4', dataIndex: 3, qux: true },
      { type: 'heatmap', seriesId: 's4', dataIndex: 3 },
    ],
    [
      'scatter',
      { type: 'scatter', seriesId: 's5', dataIndex: 4, extraProp: 'remove this too' },
      { type: 'scatter', seriesId: 's5', dataIndex: 4 },
    ],
    [
      'radar',
      { type: 'radar', seriesId: 's6', dataIndex: 5, anotherExtra: 'remove me' },
      { type: 'radar', seriesId: 's6', dataIndex: 5 },
    ],
    [
      'pie',
      { type: 'pie', seriesId: 's7', dataIndex: 6, yetAnotherExtra: 'remove this' },
      { type: 'pie', seriesId: 's7', dataIndex: 6 },
    ],
  ] as const)('should clean identifier for %s series', ([_, input, output]) => {
    const cleaned = identifierCleanerSeriesIdDataIndex(input);
    expect(cleaned).to.deep.equal(output);
  });
});
