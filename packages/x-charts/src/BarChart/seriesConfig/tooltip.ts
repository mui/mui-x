import { getLabel } from '../../internals/getLabel';
import type { AxisTriggeringTooltipGetter, TooltipGetter } from '../../internals/plugins/models';

const tooltipGetter: TooltipGetter<'bar'> = (params) => {
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

export const axisTriggeringTooltipGetter: AxisTriggeringTooltipGetter<'bar', 'x' | 'y'> = (
  series,
) => {
  return Object.values(series).map((s) =>
    s.layout === 'horizontal'
      ? { direction: 'y', axisId: s.yAxisId }
      : { direction: 'x', axisId: s.xAxisId },
  );
};

export default tooltipGetter;
