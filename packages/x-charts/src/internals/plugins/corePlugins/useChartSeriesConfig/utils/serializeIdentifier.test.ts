import { serializeIdentifier } from './serializeIdentifier';
import { barSeriesConfig } from '../../../../../BarChart/seriesConfig';
import type { ChartSeriesConfig } from '../types';

describe('serializeIdentifier', () => {
  const seriesConfig = {
    bar: barSeriesConfig,
  } as ChartSeriesConfig<'bar' | 'line'>;

  it('should serialize bar identifier using barSeriesConfig', () => {
    const result = serializeIdentifier(seriesConfig, {
      type: 'bar',
      seriesId: 's1',
      dataIndex: 0,
    });

    expect(result).toBe('Type(bar)Series(s1)Index(0)');
  });

  it('should throw an error if no serializer is found for series type', () => {
    const emptyConfig = {} as ChartSeriesConfig<'bar'>;

    expect(() => serializeIdentifier(emptyConfig, { type: 'bar', seriesId: 's1' })).toThrowError(
      'MUI X Charts: No identifier serializer found for series type "bar".',
    );
  });
});
