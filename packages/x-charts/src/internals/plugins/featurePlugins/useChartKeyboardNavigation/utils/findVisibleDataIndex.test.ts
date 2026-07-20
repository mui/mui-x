import type { ProcessedSeries } from '../../../corePlugins/useChartSeries/useChartSeries.types';
import { findVisibleDataIndex } from './findVisibleDataIndex';

describe('findVisibleDataIndex', () => {
  it('returns an index beyond the focused series length when `dataLength` allows it', () => {
    // Shared-axis types (line, bar) navigate over the longest compatible series,
    // so an index with no value in the focused series is valid.
    const processedSeries = {
      line: {
        seriesOrder: ['short', 'long'],
        series: {
          short: { data: [1, 2] },
          long: { data: [1, 2, 3] },
        },
      },
    } as unknown as ProcessedSeries<'line'>;

    expect(
      findVisibleDataIndex({
        processedSeries,
        type: 'line',
        seriesId: 'short',
        startIndex: 2,
        dataLength: 3,
        direction: 1,
        allowCycles: false,
      }),
    ).to.equal(2);
  });

  it('returns null when the index moves outside `dataLength`', () => {
    const processedSeries = {
      line: {
        seriesOrder: ['short'],
        series: {
          short: { data: [1, 2] },
        },
      },
    } as unknown as ProcessedSeries<'line'>;

    expect(
      findVisibleDataIndex({
        processedSeries,
        type: 'line',
        seriesId: 'short',
        startIndex: 3,
        dataLength: 3,
        direction: 1,
        allowCycles: false,
      }),
    ).to.equal(null);
  });
});
