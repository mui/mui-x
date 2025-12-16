import { type ProcessedSeries } from './plugins/corePlugins/useChartSeries';
import {
  getPreviousSeriesWithData,
} from './getPreviousSeriesWithData';

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


describe('getPreviousSeriesWithData', () => {
  it('should return previous series of same type if available', () => {
    expect(getPreviousSeriesWithData(seriesMultipleTypes, 'line', 'b')).to.deep.equal({
      seriesId: 'a',
      type: 'line',
    });
  });

  it('should return different series type if current series is the first one', () => {
    expect(getPreviousSeriesWithData(seriesMultipleTypes, 'line', 'a')).to.deep.equal({
      seriesId: 'b',
      type: 'bar',
    });
  });

  it('should return last series of same type if no other series type are available', () => {
    expect(getPreviousSeriesWithData(seriesSingleType, 'bar', 'a')).to.deep.equal({
      seriesId: 'b',
      type: 'bar',
    });
  });
});
