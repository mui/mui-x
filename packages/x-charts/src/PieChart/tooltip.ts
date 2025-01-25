import { getLabel } from '../internals/getLabel';
import type { TooltipGetter } from '../internals/plugins/models';

const tooltipGetter: TooltipGetter<'pie'> = (params) => {
  const { series, getColor, item } = params;

  if (!item || item.dataIndex === undefined) {
    return null;
  }

  const point = series.data[item.dataIndex];
  const label = getLabel(point.label, 'tooltip');
  const value = { ...point, label };
  const formattedValue = series.valueFormatter(value, { dataIndex: item.dataIndex });

  return {
    identifier: item,
    color: getColor(item.dataIndex),
    label,
    value,
    formattedValue,
    markType: point.labelMarkType ?? series.labelMarkType,
  };
};

export default tooltipGetter;
