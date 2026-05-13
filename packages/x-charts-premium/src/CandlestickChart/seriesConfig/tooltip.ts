import { type AxisTooltipGetter, getLabel, type TooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter: TooltipGetter<'ohlc'> = (params) => {
  const { series, getColor, identifier } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex];

  if (value == null) {
    return null;
  }

  const { dataIndex } = identifier;
  const [open, high, low, close] = value;

  return {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value: { open, high, low, close },
    formattedValue: {
      open: series.valueFormatter(open, { dataIndex, field: 'open' }),
      high: series.valueFormatter(high, { dataIndex, field: 'high' }),
      low: series.valueFormatter(low, { dataIndex, field: 'low' }),
      close: series.valueFormatter(close, { dataIndex, field: 'close' }),
    },
    markType: series.labelMarkType,
  };
};

export const axisTooltipGetter: AxisTooltipGetter<'ohlc', 'x' | 'y'> = (series) => {
  return Object.values(series).map((s) => ({ direction: 'x', axisId: s.xAxisId }));
};

export default tooltipGetter;
