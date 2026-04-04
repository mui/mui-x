import { getLabel } from '../../internals/getLabel';
import type { DescriptionGetter } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const descriptionGetter: DescriptionGetter<'pie'> = (params) => {
  const { identifier, series, localeText } = params;

  const item = series.data[identifier.dataIndex];
  const label = getLabel(item?.label, 'tooltip');
  const value = item?.value ?? null;
  const formattedValue = item?.formattedValue ?? '';
  const totalValue = series.data.reduce((acc, curr) => acc + (curr?.value ?? 0), 0);

  return localeText.pieDescription({
    value,
    totalValue,
    formattedValue,
    seriesLabel: label,
  });
};

export default descriptionGetter;
