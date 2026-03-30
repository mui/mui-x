import { getLabel, type DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'funnel'> = (params) => {
  const { identifier, series, localeText } = params;

  const item = series.data[identifier.dataIndex];
  const label = getLabel(item?.label, 'tooltip');
  const value = item?.value ?? null;
  const formattedValue = series.valueFormatter(item, { dataIndex: identifier.dataIndex });

  return localeText.funnelDescription({
    value,
    formattedValue: formattedValue ?? '',
    seriesLabel: label,
  });
};

export default descriptionGetter;
