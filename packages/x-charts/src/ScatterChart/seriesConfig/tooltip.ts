import { getLabel } from '../../internals/getLabel';
import type { TooltipGetter } from '../../internals/plugins/models';

const tooltipGetter: TooltipGetter<'scatter'> = (params) => {
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

export default tooltipGetter;
