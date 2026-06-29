import { getLabel } from '@mui/x-charts/internals';
import type { TooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter: TooltipGetter<'mapPoint'> = ({ series, getColor, identifier }) => {
  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const point = series.data[identifier.dataIndex];
  if (point == null) {
    return null;
  }

  const label = getLabel(point.label, 'tooltip');
  const formattedValue = series.valueFormatter(point, { dataIndex: identifier.dataIndex });

  return {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value: point,
    formattedValue,
    markType: series.labelMarkType,
  };
};

export default tooltipGetter;
