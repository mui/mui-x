import { ProcessedSeries } from '../../corePlugins/useChartSeries';
import {
  getNextSeriesWithData,
  getPreviousSeriesWithData,
} from './useChartKeyboardNavigation.helpers';

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

describe('useChartKeyboardNavigation - helpers', () => {
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

  describe('getNextSeriesWithData', () => {
    it('should return next series of same type if available', () => {
      expect(getNextSeriesWithData(seriesMultipleTypes, 'line', 'a')).to.deep.equal({
        seriesId: 'b',
        type: 'line',
      });
    });

    it('should return different series type if current series is the last one', () => {
      expect(getNextSeriesWithData(seriesMultipleTypes, 'line', 'b')).to.deep.equal({
        seriesId: 'a',
        type: 'bar',
      });
    });

    it('should return first series of same type if no other series type are available', () => {
      expect(getNextSeriesWithData(seriesSingleType, 'bar', 'b')).to.deep.equal({
        seriesId: 'a',
        type: 'bar',
      });
    });
  });
});
