import barProcessor from './seriesProcessor';
import { type SeriesProcessorParams } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

const seriesOrder = ['id1'];

describe('BarChart - seriesProcessor', () => {
  describe('data from dataset with dataKey', () => {
    const series: SeriesProcessorParams<'bar'>['series'] = {
      id1: {
        type: 'bar',
        id: 'id1',
        color: 'red',
        dataKey: 'k',
      },
    };

    it('should get data from the dataset', () => {
      const result = barProcessor(
        { seriesOrder, series },
        [{ k: 1 }, { k: 2 }, { k: 3 }],
      );
      expect(result.series.id1.data).to.deep.equal([1, 2, 3]);
    });

    it('should support missing values', () => {
      const result = barProcessor(
        { seriesOrder, series },
        [{ k: 1 }, { k: null }, { k: 2 }],
      );
      expect(result.series.id1.data).to.deep.equal([1, null, 2]);
    });
  });

  describe('data from valueGetter', () => {
    const series: SeriesProcessorParams<'bar'>['series'] = {
      id1: {
        type: 'bar',
        id: 'id1',
        color: 'red',
        valueGetter: (item) => parseFloat(item.k as string),
      },
    };

    it('should get data using valueGetter', () => {
      const result = barProcessor(
        { seriesOrder, series },
        [{ k: '10.5' }, { k: '20.5' }, { k: '30.5' }],
      );
      expect(result.series.id1.data).to.deep.equal([10.5, 20.5, 30.5]);
    });

    it('should support returning null from valueGetter', () => {
      const seriesWithNull: SeriesProcessorParams<'bar'>['series'] = {
        id1: {
          type: 'bar',
          id: 'id1',
          color: 'red',
          valueGetter: (item) => (item.k === 'n/a' ? null : parseFloat(item.k as string)),
        },
      };
      const result = barProcessor(
        { seriesOrder, series: seriesWithNull },
        [{ k: '10' }, { k: 'n/a' }, { k: '30' }],
      );
      expect(result.series.id1.data).to.deep.equal([10, null, 30]);
    });
  });
});
