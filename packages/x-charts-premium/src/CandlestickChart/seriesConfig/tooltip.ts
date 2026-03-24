import { type AxisTooltipGetter, getLabel, type TooltipGetter } from '@mui/x-charts/internals';

export interface OHLCTooltipValue {
  open: number;
  high: number;
  low: number;
  close: number;
}

export interface OHLCTooltipFormattedValue {
  open: string;
  high: string;
  low: string;
  close: string;
}

const tooltipGetter: TooltipGetter<'ohlc'> = (params) => {
  const { series, getColor, identifier } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const label = getLabel(series.label, 'tooltip');
  const rawValue = series.data[identifier.dataIndex];

  if (rawValue == null) {
    return null;
  }

  const [open, high, low, close] = rawValue;
  const dataIndex = identifier.dataIndex;

  const value: OHLCTooltipValue = { open, high, low, close };

  const formattedValue: OHLCTooltipFormattedValue = {
    open: series.valueFormatter(open, { dataIndex, field: 'open' }),
    high: series.valueFormatter(high, { dataIndex, field: 'high' }),
    low: series.valueFormatter(low, { dataIndex, field: 'low' }),
    close: series.valueFormatter(close, { dataIndex, field: 'close' }),
  };

  return {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value,
    formattedValue,
    markType: series.labelMarkType,
  };
};

export const axisTooltipGetter: AxisTooltipGetter<'ohlc', 'x' | 'y'> = (series) => {
  return Object.values(series).map((s) => ({ direction: 'x', axisId: s.xAxisId }));
};

export default tooltipGetter;
