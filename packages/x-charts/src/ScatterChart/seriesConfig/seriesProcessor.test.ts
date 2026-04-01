import scatterProcessor from './seriesProcessor';
import { type SeriesProcessorParams } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const seriesOrder = ['id1'];

describe('ScatterChart - seriesProcessor', () => {
  describe('data from dataset with datasetKeys', () => {
    const series: SeriesProcessorParams<'scatter'>['series'] = {
      id1: {
        type: 'scatter',
        id: 'id1',
        color: 'red',
        datasetKeys: { x: 'a', y: 'b', id: 'name' },
      },
    };

    it('should get data from the dataset', () => {
      const result = scatterProcessor(
        { seriesOrder, series },
        [
          { name: 'p1', a: 1, b: 2 },
          { name: 'p2', a: 3, b: 4 },
        ],
      );
      expect(result.series.id1.data).to.deep.equal([
        { x: 1, y: 2, z: undefined, id: 'p1' },
        { x: 3, y: 4, z: undefined, id: 'p2' },
      ]);
    });
  });

  describe('data from valueGetter', () => {
    const series: SeriesProcessorParams<'scatter'>['series'] = {
      id1: {
        type: 'scatter',
        id: 'id1',
        color: 'red',
        valueGetter: (item) => ({
          x: item.lon as number,
          y: item.lat as number,
          id: item.city as string,
        }),
      },
    };

    it('should get data using valueGetter without datasetKeys', () => {
      const result = scatterProcessor(
        { seriesOrder, series },
        [
          { city: 'London', lon: -0.12, lat: 51.5 },
          { city: 'Paris', lon: 2.35, lat: 48.86 },
        ],
      );
      expect(result.series.id1.data).to.deep.equal([
        { x: -0.12, y: 51.5, id: 'London' },
        { x: 2.35, y: 48.86, id: 'Paris' },
      ]);
    });
  });
});
