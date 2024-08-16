import { expect } from 'chai';
import { getExtremumX } from './extremums';
import { ExtremumGetter } from '../context/PluginProvider';

const buildData = (
  data: number[],
  layout: 'vertical' | 'horizontal' = 'vertical',
): Parameters<ExtremumGetter<'bar'>>[0] => {
  return {
    series: {
      id1: {
        id: 'id1',
        type: 'bar',
        color: 'red',
        data,
        stackedData: data.length
          ? [
              [data[0], data[1]],
              [data[2], data[3]],
            ]
          : [],
        layout,
      },
    },
    axis: {
      id: 'id',
      data,
    },
    isDefaultAxis: true,
  };
};

describe('BarChart - extremums', () => {
  describe('getExtremumX', () => {
    describe('vertical', () => {
      it('should correctly get the extremes from axis', () => {
        const [x, y] = getExtremumX(buildData([-1, 2, 3, 8]));
        expect(x).to.equal(-1);
        expect(y).to.equal(8);
      });

      it('should correctly get Infinity when empty data', () => {
        const [x, y] = getExtremumX(buildData([]));
        expect(x).to.equal(Infinity);
        expect(y).to.equal(-Infinity);
      });
    });

    describe('horizontal', () => {
      it('should correctly get the extremes from axis', () => {
        const [x, y] = getExtremumX(buildData([-1, 2, 3, 8], 'horizontal'));
        expect(x).to.equal(-1);
        expect(y).to.equal(8);
      });

      it('should correctly get Infinity when empty data', () => {
        const [x, y] = getExtremumX(buildData([], 'horizontal'));
        expect(x).to.equal(Infinity);
        expect(y).to.equal(-Infinity);
      });
    });
  });
});
