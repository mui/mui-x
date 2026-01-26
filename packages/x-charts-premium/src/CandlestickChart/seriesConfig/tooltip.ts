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

  const formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });

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
  return Object.values(series).map((s) => ({ direction: 'y', axisId: s.yAxisId }));
};

export default tooltipGetter;
