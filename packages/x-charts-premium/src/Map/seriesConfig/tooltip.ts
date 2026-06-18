import { getLabel } from '@mui/x-charts/internals';
import type { TooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter: TooltipGetter<'mapShape'> = ({ series, getColor, identifier }) => {
  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }

  const point = series.data[identifier.dataIndex];
  if (point == null) {
    return null;
  }
  const color = getColor(identifier.dataIndex);
  if (color === null) {
    return null;
  }

  const label = getLabel(point.label ?? point.name, 'tooltip');
  const formattedValue = series.valueFormatter(point, { dataIndex: identifier.dataIndex });

  return {
    identifier,
    color,
    label,
    value: point,
    formattedValue,
    markType: series.labelMarkType,
  };
};

export default tooltipGetter;
