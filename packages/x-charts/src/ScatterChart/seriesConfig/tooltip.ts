import { getLabel } from '../../internals/getLabel';
import type { AxisTooltipGetter, TooltipGetter } from '../../internals/plugins/models';

export const tooltipGetter: TooltipGetter<'scatter'> = (params) => {
  const { series, getColor, identifier } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex];
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

export const axisTooltipGetter: AxisTooltipGetter<'scatter', 'x' | 'y'> = (series) => {
  return Object.values(series).map((s) => ({ direction: 'x', axisId: s.xAxisId }));
};
