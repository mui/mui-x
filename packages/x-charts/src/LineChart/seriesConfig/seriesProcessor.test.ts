import lineProcessor from './seriesProcessor';
import { type SeriesProcessorParams } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const seriesOrder = ['id1'];
const seriesDataset: SeriesProcessorParams<'line'>['series'] = {
  id1: {
    // useless info
    type: 'line',
    id: 'id1',
    color: 'red',
    // useful info
    dataKey: 'k',
  },
};

const seriesWithValueGetter: SeriesProcessorParams<'line'>['series'] = {
  id1: {
    type: 'line',
    id: 'id1',
    color: 'red',
    valueGetter: (item) => parseFloat(item.k as string),
  },
};

const dataSet = [{ k: 1 }, { k: 2 }, { k: 3 }];

describe('LineChart - formatter', () => {
  describe('data from dataset', () => {
    it('should get data from the dataset', () => {
      const { series } = lineProcessor({ seriesOrder, series: seriesDataset }, dataSet);
      expect(series.id1.data).to.deep.equal([1, 2, 3]);
    });

    it('should support missing values', () => {
      const { series } = lineProcessor({ seriesOrder, series: seriesDataset }, [
        { k: 1 },
        { k: null },
        { k: 2 },
      ]);
      expect(series.id1.data).to.deep.equal([1, null, 2]);
    });
  });

  describe('data from valueGetter', () => {
    it('should get data using valueGetter', () => {
      const { series } = lineProcessor({ seriesOrder, series: seriesWithValueGetter }, [
        { k: '1.5' },
        { k: '2.5' },
        { k: '3.5' },
      ]);
      expect(series.id1.data).to.deep.equal([1.5, 2.5, 3.5]);
    });

    it('should support returning null from valueGetter', () => {
      const seriesWithNullGetter: SeriesProcessorParams<'line'>['series'] = {
        id1: {
          type: 'line',
          id: 'id1',
          color: 'red',
          valueGetter: (item) => (item.k === 'missing' ? null : parseFloat(item.k as string)),
        },
      };
      const { series } = lineProcessor({ seriesOrder, series: seriesWithNullGetter }, [
        { k: '1' },
        { k: 'missing' },
        { k: '3' },
      ]);
      expect(series.id1.data).to.deep.equal([1, null, 3]);
    });
  });
});
