import { expect } from 'chai';
import { getExtremumX, getExtremumY } from './seriesConfig/extremums';
import { CartesianExtremumGetter } from '../internals/plugins/models';

const buildData = (
  data: number[],
  layout: 'vertical' | 'horizontal' = 'vertical',
): Parameters<CartesianExtremumGetter<'bar'>>[0] => {
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
        valueFormatter: () => '',
      },
    },
    axis: {
      id: 'id',
      data,
    },
    axisIndex: 0,
    isDefaultAxis: true,
  };
};

const buildDataWithAxisId = (
  data: number[],
  layout: 'vertical' | 'horizontal' = 'vertical',
  testedDirection: 'x' | 'y' = 'x',
): Parameters<CartesianExtremumGetter<'bar'>>[0] => {
  const axesIds =
    layout === 'horizontal'
      ? { yAxisId: 'axis-id', xAxisId: 'other-id' }
      : { xAxisId: 'axis-id', yAxisId: 'other-id' };

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
        valueFormatter: () => '',
        ...axesIds,
      },
    },
    axis: {
      id: axesIds[`${testedDirection}AxisId`],
      data,
    },
    axisIndex: 0,
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

      it('should correctly get the extremes from axis with axis id', () => {
        const [x, y] = getExtremumX(buildDataWithAxisId([-1, 2, 3, 8]));
        expect(x).to.equal(-1);
        expect(y).to.equal(8);
      });

      it('should correctly get Infinity when empty data with axis id', () => {
        const [x, y] = getExtremumX(buildDataWithAxisId([]));
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

      it('should correctly get the extremes from axis with axis id', () => {
        const [x, y] = getExtremumX(buildDataWithAxisId([-1, 2, 3, 8], 'horizontal'));
        expect(x).to.equal(-1);
        expect(y).to.equal(8);
      });

      it('should correctly get Infinity when empty data with axis id', () => {
        const [x, y] = getExtremumX(buildDataWithAxisId([], 'horizontal'));
        expect(x).to.equal(Infinity);
        expect(y).to.equal(-Infinity);
      });
    });
  });

  describe('getExtremumY', () => {
    describe('vertical', () => {
      it('should correctly get the extremes from axis', () => {
        const [x, y] = getExtremumY(buildData([-1, 2, 3, 8]));
        expect(x).to.equal(-1);
        expect(y).to.equal(8);
      });

      it('should correctly get Infinity when empty data', () => {
        const [x, y] = getExtremumY(buildData([]));
        expect(x).to.equal(Infinity);
        expect(y).to.equal(-Infinity);
      });

      it('should correctly get the extremes from axis with axis id', () => {
        const [x, y] = getExtremumY(buildDataWithAxisId([-1, 2, 3, 8], 'vertical', 'y'));
        expect(x).to.equal(-1);
        expect(y).to.equal(8);
      });

      it('should correctly get Infinity when empty data with axis id', () => {
        const [x, y] = getExtremumY(buildDataWithAxisId([], 'vertical', 'y'));
        expect(x).to.equal(Infinity);
        expect(y).to.equal(-Infinity);
      });
    });

    describe('horizontal', () => {
      it('should correctly get the extremes from axis', () => {
        const [x, y] = getExtremumY(buildData([-1, 2, 3, 8], 'horizontal'));
        expect(x).to.equal(-1);
        expect(y).to.equal(8);
      });

      it('should correctly get Infinity when empty data', () => {
        const [x, y] = getExtremumY(buildData([], 'horizontal'));
        expect(x).to.equal(Infinity);
        expect(y).to.equal(-Infinity);
      });

      it('should correctly get the extremes from axis with axis id', () => {
        const [x, y] = getExtremumY(buildDataWithAxisId([-1, 2, 3, 8], 'horizontal', 'y'));
        expect(x).to.equal(-1);
        expect(y).to.equal(8);
      });

      it('should correctly get Infinity when empty data with axis id', () => {
        const [x, y] = getExtremumY(buildDataWithAxisId([], 'horizontal', 'y'));
        expect(x).to.equal(Infinity);
        expect(y).to.equal(-Infinity);
      });
    });
  });
});
