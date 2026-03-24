import { describe, it, expect } from 'vitest';
import seriesProcessor from './seriesProcessor';

describe('Candlestick seriesProcessor', () => {
  const baseParams = {
    seriesOrder: ['s1' as const],
    series: {
      s1: {
        id: 's1' as const,
        type: 'ohlc' as const,
        color: 'red',
        data: [
          [100, 110, 90, 105] as [number, number, number, number],
          [105, 115, 95, 110] as [number, number, number, number],
        ],
      },
    },
  };

  it('should use the default valueFormatter when none is provided', () => {
    const result = seriesProcessor(baseParams);
    const series = result.series.s1;

    expect(series.valueFormatter(100, { dataIndex: 0, field: 'open' })).toBe('100');
    expect(series.valueFormatter(null, { dataIndex: 0, field: 'open' })).toBe('');
  });

  it('should use a custom valueFormatter when provided', () => {
    const customFormatter = (value: number | null) =>
      value == null ? 'N/A' : `$${value.toFixed(2)}`;

    const result = seriesProcessor({
      ...baseParams,
      series: {
        s1: {
          ...baseParams.series.s1,
          valueFormatter: customFormatter,
        },
      },
    });

    const series = result.series.s1;
    expect(series.valueFormatter(100, { dataIndex: 0, field: 'open' })).toBe('$100.00');
    expect(series.valueFormatter(null, { dataIndex: 0, field: 'high' })).toBe('N/A');
  });

  it('should provide field context to the valueFormatter', () => {
    const fields: string[] = [];
    const customFormatter = (value: number | null, context: { field: string }) => {
      fields.push(context.field);
      return String(value);
    };

    const result = seriesProcessor({
      ...baseParams,
      series: {
        s1: {
          ...baseParams.series.s1,
          valueFormatter: customFormatter,
        },
      },
    });

    const series = result.series.s1;
    series.valueFormatter(100, { dataIndex: 0, field: 'open' });
    series.valueFormatter(110, { dataIndex: 0, field: 'high' });
    series.valueFormatter(90, { dataIndex: 0, field: 'low' });
    series.valueFormatter(105, { dataIndex: 0, field: 'close' });

    expect(fields).toEqual(['open', 'high', 'low', 'close']);
  });
});
