import type { SeriesProcessor, SeriesId, ChartSeriesDefaultized } from '@mui/x-charts/internals';

const defaultValueFormatter = ((v) =>
  v == null ? '' : String(v.value)) as ChartSeriesDefaultized<'mapShape'>['valueFormatter'];

const seriesProcessor: SeriesProcessor<'mapShape'> = (
  { series, seriesOrder },
  _dataset,
  isItemVisible,
) => {
  const defaultizedSeries: Record<SeriesId, ChartSeriesDefaultized<'mapShape'>> = {};

  seriesOrder.forEach((seriesId) => {
    const input = series[seriesId];
    const data = input.data ?? [];
    defaultizedSeries[seriesId] = {
      labelMarkType: 'square',
      ...input,
      data: data.map((item, dataIndex) => ({
        ...item,
        hidden: !isItemVisible?.({ type: 'mapShape', seriesId, dataIndex }),
      })),
      hidden: !isItemVisible?.({ type: 'mapShape', seriesId }),
      valueFormatter: input.valueFormatter ?? defaultValueFormatter,
    };
  });

  return {
    series: defaultizedSeries,
    seriesOrder,
  };
};

export default seriesProcessor;
