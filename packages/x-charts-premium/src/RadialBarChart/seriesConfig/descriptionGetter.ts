import { getLabel, type DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'radialBar'> = (params) => {
  const { identifier, series, rotationAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const dataIndex = identifier.dataIndex;

  const value = series.data[dataIndex] ?? null;
  const categoryValue = rotationAxis.data?.[dataIndex] ?? null;

  const formattedValue = series.valueFormatter(value, { dataIndex });
  const formattedCategory = rotationAxis.valueFormatter?.(categoryValue, {
    location: 'tooltip',
    scale: rotationAxis.scale,
  });

  return localeText.barDescription({
    value,
    formattedValue: formattedValue ?? '',
    categoryValue,
    formattedCategoryValue: formattedCategory ?? '',
    seriesLabel: label,
  });
};

export default descriptionGetter;
