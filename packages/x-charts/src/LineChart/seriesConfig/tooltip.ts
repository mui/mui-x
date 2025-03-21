import { getLabel } from '../../internals/getLabel';
import type { AxisTriggeringTooltipGetter, TooltipGetter } from '../../internals/plugins/models';

const tooltipGetter: TooltipGetter<'line'> = (params) => {
  const { series, getColor, identifier } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex];
  const formattedValue = series.valueFormatter(value as any, { dataIndex: identifier.dataIndex });

  return {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value,
    formattedValue,
    markType: series.labelMarkType,
  };
};

export const axisTriggeringTooltipGetter: AxisTriggeringTooltipGetter<'line', 'x' | 'y'> = (
  series,
) => {
  return Object.values(series).map((s) => ({ direction: 'x', axisId: s.xAxisId }));
};

export default tooltipGetter;
