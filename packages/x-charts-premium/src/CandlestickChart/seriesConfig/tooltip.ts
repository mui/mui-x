import { type AxisTooltipGetter, getLabel, type TooltipGetter } from '@mui/x-charts/internals';
import { type OHLCField } from '../../models';

const OHLC_FIELDS: OHLCField[] = ['open', 'high', 'low', 'close'];

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

  const formattedValue = OHLC_FIELDS.map((field, i) =>
    series.valueFormatter(value[i], { dataIndex: identifier.dataIndex, field }),
  ).join(', ');

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
