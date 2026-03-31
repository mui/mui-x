import { getLabel, type DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'rangeBar'> = (params) => {
  const { identifier, series, xAxis, yAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex] ?? null;

  const isHorizontal = series.layout === 'horizontal';
  const categoryAxis = isHorizontal ? yAxis : xAxis;
  const categoryValue = categoryAxis.data?.[identifier.dataIndex] ?? null;

  const formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex }) ?? '';
  const formattedCategoryValue =
    categoryAxis.valueFormatter?.(categoryValue, {
      location: 'tooltip',
      scale: categoryAxis.scale,
    }) ?? '';

  return localeText.rangeBarDescription({
    value,
    formattedValue,
    categoryValue,
    formattedCategoryValue,
    seriesLabel: label,
  });
};

export default descriptionGetter;
