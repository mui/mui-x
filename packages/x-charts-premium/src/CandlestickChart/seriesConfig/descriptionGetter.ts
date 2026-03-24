import { getLabel, type DescriptionGetter } from '@mui/x-charts/internals';

const descriptionGetter: DescriptionGetter<'ohlc'> = (params) => {
  const { identifier, series, xAxis, localeText } = params;

  const label = getLabel(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex] ?? null;

  const date = xAxis.data?.[identifier.dataIndex] ?? null;

  const formattedDate =
    xAxis.valueFormatter?.(date, {
      location: 'tooltip',
      scale: xAxis.scale,
    }) ?? '';

  return localeText.ohlcDescription({
    open: value?.[0] ?? null,
    high: value?.[1] ?? null,
    low: value?.[2] ?? null,
    close: value?.[3] ?? null,
    date,
    formattedDate,
    seriesLabel: label,
  });
};

export default descriptionGetter;
