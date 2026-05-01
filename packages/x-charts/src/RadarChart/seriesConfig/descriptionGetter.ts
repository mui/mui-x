import { getLabel } from '../../internals/getLabel';
import type { DescriptionGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'radar'> = (params) => {
  const { identifier, series, rotationAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const dataIndex = identifier.dataIndex;

  if (dataIndex === undefined) {
    return '';
  }

  const value = series.data[dataIndex] ?? null;
  const categoryValue = rotationAxis.data?.[dataIndex] ?? null;

  const formattedValue = series.valueFormatter(value, { dataIndex });
  const formattedCategory = rotationAxis.valueFormatter?.(categoryValue, {
    location: 'tooltip',
    scale: rotationAxis.scale,
  });

  return localeText.radarDescription({
    value,
    formattedValue: formattedValue ?? '',
    categoryValue,
    formattedCategoryValue: formattedCategory ?? '',
    seriesLabel: label,
  });
};

export default descriptionGetter;
