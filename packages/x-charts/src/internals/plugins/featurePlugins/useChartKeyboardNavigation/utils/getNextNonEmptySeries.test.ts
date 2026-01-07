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

const singleSeries: ProcessedSeries<'bar'> = {
  bar: {
    series: {
      a: {
        data: [1, 2],
        id: 'a',
        ...barSeries,
      },
    },
    seriesOrder: ['a'],
    stackingGroups: [],
  },
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

const nullifySeries = (series: ProcessedSeries<any>, type: string, id: string) => {
  return {
    ...series,
    [type]: {
      ...series[type],
      series: {
        ...series[type]?.series,
        [id]: { ...series[type]?.series[id], data: series[type]?.series[id].data.map(() => null) },
      },
    },
  };
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

  it('should not return first series of same type if the series is full of null values', () => {
    expect(
      getNextNonEmptySeries(
        nullifySeries(seriesSingleType, 'bar', 'a'),
        new Set(['bar']),
        'bar',
        'b',
      ),
    ).to.deep.equal({
      seriesId: 'b',
      type: 'bar',
    });
  });

  it('should not move focus if no other series are available', () => {
    expect(getNextNonEmptySeries(singleSeries, new Set(['bar', 'line']), 'bar', 'a')).to.deep.equal(
      {
        seriesId: 'a',
        type: 'bar',
      },
    );
  });
});
