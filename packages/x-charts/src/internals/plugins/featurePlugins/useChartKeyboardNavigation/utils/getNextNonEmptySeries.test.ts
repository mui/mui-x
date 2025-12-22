import { type ProcessedSeries } from '../../../corePlugins/useChartSeries';
import { getNextNonEmptySeries } from './getNextNonEmptySeries';

const barSeries = {
  type: 'bar' as const,
  stackedData: [],
  valueFormatter: () => '',
  color: '',
  layout: 'horizontal' as const,
  minBarSize: 10,
};

const lineSeries = {
  type: 'line' as const,
  stackedData: [],
  valueFormatter: () => '',
  color: '',
};

const seriesSingleType: ProcessedSeries<'bar'> = {
  bar: {
    series: {
      b: {
        data: [1, 2],
        id: 'b',
        ...barSeries,
      },
      a: {
        data: [1, 2],
        id: 'a',
        ...barSeries,
      },
    },
    seriesOrder: ['a', 'b'],
    stackingGroups: [],
  },
};

const seriesMultipleTypes: ProcessedSeries<'bar' | 'line'> = {
  bar: {
    series: {
      b: {
        data: [1, 2],
        id: 'b',
        ...barSeries,
      },
      a: {
        data: [1, 2],
        id: 'a',
        ...barSeries,
      },
    },
    seriesOrder: ['a', 'b'],
    stackingGroups: [],
  },
  line: {
    series: {
      b: {
        data: [1, 2],
        id: 'b',
        ...lineSeries,
      },
      a: {
        data: [1, 2],
        id: 'a',
        ...lineSeries,
      },
    },
    seriesOrder: ['a', 'b'],
    stackingGroups: [],
  },
};

describe('getNextNonEmptySeries', () => {
  it('should return next series of same type if available', () => {
    expect(
      getNextNonEmptySeries(seriesMultipleTypes, new Set(['line']), 'line', 'a'),
    ).to.deep.equal({
      seriesId: 'b',
      type: 'line',
    });
  });

  it('should return different series type if current series is the last one', () => {
    expect(
      getNextNonEmptySeries(seriesMultipleTypes, new Set(['line', 'bar']), 'line', 'b'),
    ).to.deep.equal({
      seriesId: 'a',
      type: 'bar',
    });
  });

  it('should return first series of same type if no other series type are available', () => {
    expect(getNextNonEmptySeries(seriesSingleType, new Set(['bar']), 'bar', 'b')).to.deep.equal({
      seriesId: 'a',
      type: 'bar',
    });
  });
});
