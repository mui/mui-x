import { expect } from 'chai';
import { FormatterParams } from '../models/seriesType/config';
import lineFormatter from './formatter';

const seriesOrder = ['id1'];
const seriesDataset: FormatterParams<'line'>['series'] = {
  id1: {
    // useless info
    type: 'line',
    id: 'id1',
    color: 'red',
    // usefull info
    dataKey: 'k',
  },
};

const dataSet = [{ k: 1 }, { k: 2 }, { k: 3 }];

describe('LineChart - formatter', () => {
  describe('data from dataset', () => {
    it('should get data from the dataset', () => {
      const { series } = lineFormatter({ seriesOrder, series: seriesDataset }, dataSet);
      expect(series.id1.data).to.deep.equal([1, 2, 3]);
    });

    it('should support missing values', () => {
      const { series } = lineFormatter({ seriesOrder, series: seriesDataset }, [
        { k: 1 },
        { k: null },
        { k: 2 },
      ]);
      expect(series.id1.data).to.deep.equal([1, null, 2]);
    });
  });
});
