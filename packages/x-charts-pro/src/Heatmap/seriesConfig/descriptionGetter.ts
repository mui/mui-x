import type { DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'heatmap'> = (params) => {
  const { identifier, series, xAxis, yAxis, localeText } = params;

  const value = series.heatmapData.getValue(identifier.xIndex, identifier.yIndex);

  const xValue = xAxis.data?.[identifier.xIndex] ?? null;
  const yValue = yAxis.data?.[identifier.yIndex] ?? null;

  const formattedValue = series.valueFormatter?.(value, {
    xIndex: identifier.xIndex,
    yIndex: identifier.yIndex,
  });

  const formattedXValue =
    xAxis.valueFormatter?.(xValue, {
      location: 'tooltip',
      scale: xAxis.scale,
    }) ?? '';

  const formattedYValue =
    yAxis.valueFormatter?.(yValue, {
      location: 'tooltip',
      scale: yAxis.scale,
    }) ?? '';

  return localeText.heatmapDescription({
    x: xValue,
    y: yValue,
    value,
    formattedValue: formattedValue ?? '',
    formattedXValue,
    formattedYValue,
  });
};

export default descriptionGetter;
