import { describe, it, expect, vi } from 'vitest';
import tooltipGetter from './tooltip';
import { type OHLCTooltipValue, type OHLCTooltipFormattedValue } from './tooltip';

describe('Candlestick tooltipGetter', () => {
  const baseSeries = {
    id: 's1',
    type: 'ohlc' as const,
    color: 'red',
    data: [
      [100, 110, 90, 105] as [number, number, number, number],
      [105, 115, 95, 110] as [number, number, number, number],
    ],
    valueFormatter: (v: number | null) => (v == null ? '' : `$${v}`),
    label: 'Stock',
  };

  const baseIdentifier = {
    type: 'ohlc' as const,
    seriesId: 's1',
    dataIndex: 0,
  };

  const getColor = () => 'red';

  it('should return value as an object with OHLC fields', () => {
    const result = tooltipGetter({
      series: baseSeries as any,
      axesConfig: {},
      getColor,
      identifier: baseIdentifier,
    });

    expect(result).not.toBeNull();
    expect(result!.value as unknown as OHLCTooltipValue).toEqual({
      open: 100,
      high: 110,
      low: 90,
      close: 105,
    });
  });

  it('should return formattedValue as an object with OHLC fields', () => {
    const result = tooltipGetter({
      series: baseSeries as any,
      axesConfig: {},
      getColor,
      identifier: baseIdentifier,
    });

    expect(result).not.toBeNull();
    expect(result!.formattedValue as unknown as OHLCTooltipFormattedValue).toEqual({
      open: '$100',
      high: '$110',
      low: '$90',
      close: '$105',
    });
  });

  it('should pass the correct field context to valueFormatter', () => {
    const fields: string[] = [];
    const formatter = vi.fn((v: number | null, ctx: { field: string }) => {
      fields.push(ctx.field);
      return String(v);
    });

    tooltipGetter({
      series: { ...baseSeries, valueFormatter: formatter } as any,
      axesConfig: {},
      getColor,
      identifier: baseIdentifier,
    });

    expect(fields).toEqual(['open', 'high', 'low', 'close']);
  });

  it('should return null for null identifier', () => {
    const result = tooltipGetter({
      series: baseSeries as any,
      axesConfig: {},
      getColor,
      identifier: null,
    });

    expect(result).toBeNull();
  });

  it('should return null for null value', () => {
    const result = tooltipGetter({
      series: { ...baseSeries, data: [null] } as any,
      axesConfig: {},
      getColor,
      identifier: baseIdentifier,
    });

    expect(result).toBeNull();
  });
});
