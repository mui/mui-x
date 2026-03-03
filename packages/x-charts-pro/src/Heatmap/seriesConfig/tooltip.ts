import { getLabel, type TooltipGetter } from '@mui/x-charts/internals';

const tooltipGetter: TooltipGetter<'heatmap'> = (params) => {
  const { series, getColor, identifier } = params;

  if (!identifier) {
    return null;
  }

  const cellValue = series.valueLookup.get(identifier.xIndex)?.get(identifier.yIndex) ?? null;

  const label = getLabel(series.label, 'tooltip');
  const formattedValue = series.valueFormatter(cellValue, {
    xIndex: identifier.xIndex,
    yIndex: identifier.yIndex,
  });

  return {
    identifier,
    color: getColor(cellValue, identifier.xIndex, identifier.yIndex),
    label,
    value: cellValue,
    formattedValue,
    markType: series.labelMarkType,
  };
};

export default tooltipGetter;
