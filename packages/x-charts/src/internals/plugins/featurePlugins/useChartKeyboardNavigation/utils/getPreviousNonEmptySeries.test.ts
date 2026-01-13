import { type ProcessedSeries } from '../../../corePlugins/useChartSeries';
import { getPreviousNonEmptySeries } from './getPreviousNonEmptySeries';

const barSeries = {
  type: 'bar' as const,
  stackedData: [],
  visibleStackedData: [],
  valueFormatter: () => '',
  color: '',
  layout: 'horizontal' as const,
  minBarSize: 10,
  hidden: false,
};

const lineSeries = {
  type: 'line' as const,
  stackedData: [],
  visibleStackedData: [],
  valueFormatter: () => '',
  color: '',
  hidden: false,
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

describe('getPreviousNonEmptySeries', () => {
  it('should return previous series of same type if available', () => {
    expect(
      getPreviousNonEmptySeries(seriesMultipleTypes, new Set(['line']), 'line', 'b'),
    ).to.deep.equal({
      seriesId: 'a',
      type: 'line',
    });
  });

  it('should return different series type if current series is the first one', () => {
    expect(
      getPreviousNonEmptySeries(seriesMultipleTypes, new Set(['bar', 'line']), 'line', 'a'),
    ).to.deep.equal({
      seriesId: 'b',
      type: 'bar',
    });
  });

  it('should return last series of same type if no other series type are available', () => {
    expect(getPreviousNonEmptySeries(seriesSingleType, new Set(['bar']), 'bar', 'a')).to.deep.equal(
      {
        seriesId: 'b',
        type: 'bar',
      },
    );
  });

  it('should not move focus if no other series are available', () => {
    expect(
      getPreviousNonEmptySeries(singleSeries, new Set(['bar', 'line']), 'bar', 'a'),
    ).to.deep.equal({
      seriesId: 'a',
      type: 'bar',
    });
  });
});
