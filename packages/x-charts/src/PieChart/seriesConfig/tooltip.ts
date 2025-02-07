import { getLabel } from '../../internals/getLabel';
import type { TooltipGetter } from '../../internals/plugins/models';

const tooltipGetter: TooltipGetter<'pie'> = (params) => {
  const { series, getColor, identifier } = params;

  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const point = series.data[identifier.dataIndex];
  const label = getLabel(point.label, 'tooltip');
  const value = { ...point, label };
  const formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });

  return {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value,
    formattedValue,
    markType: point.labelMarkType ?? series.labelMarkType,
  };
};

export default tooltipGetter;
