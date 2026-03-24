import { getLabel } from '../../internals/getLabel';
import type { DescriptionGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'line'> = (params) => {
  const { identifier, series, xAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const dataIndex = identifier.dataIndex;

  if (dataIndex === undefined) {
    return ''
  }

  const xValue = xAxis.data?.[dataIndex] ?? null;
  const yValue = series.data[dataIndex] ?? null;

  const formattedXValue = xAxis.valueFormatter?.(xValue, {
    location: 'tooltip',
    scale: xAxis.scale,
  });
  const formattedYValue = series.valueFormatter(yValue, { dataIndex });

  return localeText.lineDescription({
    x: xValue,
    y: yValue,
    formattedXValue: formattedXValue ?? '',
    formattedYValue: formattedYValue ?? '',
    seriesLabel: label,
  });
};

export default descriptionGetter;
