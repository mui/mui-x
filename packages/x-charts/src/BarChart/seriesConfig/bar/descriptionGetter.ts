import { getLabel } from '../../../internals/getLabel';
import type { DescriptionGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'bar'> = (params) => {
  const { identifier, series, xAxis, yAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex];

  const isHorizontal = series.layout === 'horizontal';
  const categoryAxis = isHorizontal ? yAxis : xAxis;
  const categoryValue = categoryAxis.data?.[identifier.dataIndex];

  const formattedValue = series.valueFormatter(value, { dataIndex: identifier.dataIndex });
  const formattedCategory = categoryAxis.valueFormatter?.(categoryValue, {
    location: 'tooltip',
    scale: categoryAxis.scale,
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
