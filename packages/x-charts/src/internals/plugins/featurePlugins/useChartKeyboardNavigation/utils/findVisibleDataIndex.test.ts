import type { ProcessedSeries } from '../../../corePlugins/useChartSeries/useChartSeries.types';
import { findVisibleDataIndex } from './findVisibleDataIndex';

describe('findVisibleDataIndex', () => {
  it('does not return an index outside the focused series', () => {
    const processedSeries = {
      scatter: {
        seriesOrder: ['short', 'long'],
        series: {
          short: {
            data: [
              { x: 1, y: 1 },
              { x: 2, y: 2 },
            ],
          },
          long: {
            data: [
              { x: 1, y: 1 },
              { x: 2, y: 2 },
              { x: 3, y: 3 },
            ],
          },
        },
      },
    } as unknown as ProcessedSeries<'scatter'>;

    expect(
      findVisibleDataIndex({
        processedSeries,
        type: 'scatter',
        seriesId: 'short',
        startIndex: 2,
        dataLength: 3,
        direction: 1,
        allowCycles: false,
      }),
    ).to.equal(1);
  });
});
