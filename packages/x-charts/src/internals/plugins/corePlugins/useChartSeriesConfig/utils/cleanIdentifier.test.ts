import { cleanIdentifier } from './cleanIdentifier';
import { lineSeriesConfig } from '../../../../../LineChart/seriesConfig';
import type { ChartSeriesConfig } from '../../../models';

describe('cleanIdentifier', () => {
  const seriesConfig = {
    line: lineSeriesConfig,
  } as ChartSeriesConfig<'bar' | 'line'>;

  it('should clean line identifier using lineSeriesConfig', () => {
    const result = cleanIdentifier(seriesConfig, {
      type: 'line',
      seriesId: 's2',
      dataIndex: 5,
      extraProp: 'remove this',
    });

    expect(result).to.deep.equal({ type: 'line', seriesId: 's2', dataIndex: 5 });
  });

  it('should throw an error if no cleaner is found for series type', () => {
    const emptyConfig = {} as ChartSeriesConfig<'bar'>;

    expect(() => cleanIdentifier(emptyConfig, { type: 'bar', seriesId: 's1' })).toThrowError(
      'MUI X Charts: No identifier cleaner found for series type "bar".',
    );
  });
});
