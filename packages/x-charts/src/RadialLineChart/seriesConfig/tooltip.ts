import { getLabel } from '../../internals/getLabel';
import type {
  AxisTooltipGetter,
  TooltipGetter,
} from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const tooltipGetter: TooltipGetter<'radial-line'> = (params) => {
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
    markShape: series.showMark ? series.shape : undefined,
  };
};

export const axisTooltipGetter: AxisTooltipGetter<'radial-line', 'rotation' | 'radius'> = (
  series,
) => {
  return Object.values(series).map((s) => ({ direction: 'rotation', axisId: s.rotationAxisId }));
};

export default tooltipGetter;
