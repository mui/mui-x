import { getLabel } from '@mui/x-charts/internals';
import type { TooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter: TooltipGetter<'mapShape'> = ({ series, getColor, identifier }) => {
  if (!identifier || identifier.name === undefined) {
    return null;
  }

  const index = series.lookupByName.get(identifier.name);
  if (index === undefined) {
    return null;
  }
  const point = series.data[index];
  if (point == null) {
    return null;
  }
  const color = getColor(identifier.name);
  if (color === null) {
    return null;
  }

  const label = getLabel(point.label ?? point.name, 'tooltip');
  const formattedValue = series.valueFormatter(point, { dataIndex: index });

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
