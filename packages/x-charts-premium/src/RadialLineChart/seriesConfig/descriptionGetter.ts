import { getLabel } from '../../../../x-charts/src/internals/getLabel';
import type { DescriptionGetter } from '../../../../x-charts/src/internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'radial-line'> = (params) => {
  const { identifier, series, rotationAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const dataIndex = identifier.dataIndex;

  if (dataIndex === undefined) {
    return '';
  }

  const xValue = rotationAxis.data?.[dataIndex] ?? null;
  const yValue = series.data[dataIndex] ?? null;

  const formattedXValue = rotationAxis.valueFormatter?.(xValue, {
    location: 'tooltip',
    scale: rotationAxis.scale,
  });
  const formattedYValue = series.valueFormatter(yValue, { dataIndex });

  // We reuse the description for the LineChart with x/y for the rotation/radius.
  return localeText.lineDescription({
    x: xValue,
    y: yValue,
    formattedXValue: formattedXValue ?? '',
    formattedYValue: formattedYValue ?? '',
    seriesLabel: label,
  });
};

export default descriptionGetter;
