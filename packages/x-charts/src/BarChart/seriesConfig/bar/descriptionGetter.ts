import { getLabel } from '../../../internals/getLabel';
import type { DescriptionGetter } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'bar'> = (params) => {
  const { identifier, series, xAxis, yAxis } = params;

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex];

  const isHorizontal = series.layout === 'horizontal';
  const categoryAxis = isHorizontal ? yAxis : xAxis;
  const categoryValue = categoryAxis.data?.[identifier.dataIndex];

  const formattedValue =
    value != null ? series.valueFormatter(value, { dataIndex: identifier.dataIndex }) : null;

  const parts: string[] = [];

  if (label) {
    parts.push(label);
  }

  if (categoryValue != null) {
    const formattedCategory = categoryAxis.valueFormatter?.(categoryValue, {
      location: 'tooltip',
      scale: categoryAxis.scale,
    });
    parts.push(formattedCategory ?? String(categoryValue));
  }

  if (formattedValue != null) {
    parts.push(formattedValue);
  }

  return parts.join(', ');
};

export default descriptionGetter;
