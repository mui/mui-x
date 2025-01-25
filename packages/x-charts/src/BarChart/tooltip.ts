import { getLabel } from '../internals/getLabel';
import type { TooltipGetter } from '../internals/plugins/models';

const tooltipGetter: TooltipGetter<'bar'> = (params) => {
  const { series, getColor, item } = params;

  if (!item || item.dataIndex === undefined) {
    return null;
  }

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[item.dataIndex];
  const formattedValue = series.valueFormatter(value as any, { dataIndex: item.dataIndex });

  return {
    identifier: item,
    color: getColor(item.dataIndex),
    label,
    value,
    formattedValue,
    markType: series.labelMarkType,
  };
};

export default tooltipGetter;
