import { getLabel } from '../../internals/getLabel';
import type { DescriptionGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'scatter'> = (params) => {
  const { identifier, series, xAxis, yAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const item = series.data[identifier.dataIndex];

  const formattedXValue =
    xAxis.valueFormatter?.(item?.x, {
      location: 'tooltip',
      scale: xAxis.scale,
    }) ?? '';

  const formattedYValue =
    yAxis.valueFormatter?.(item?.y, {
      location: 'tooltip',
      scale: yAxis.scale,
    }) ?? '';

  return localeText.scatterDescription({
    x: item?.x ?? null,
    y: item?.y ?? null,
    formattedXValue,
    formattedYValue,
    seriesLabel: label,
  });
};

export default descriptionGetter;
