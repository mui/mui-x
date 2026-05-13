import type { SeriesProcessor, SeriesId } from '@mui/x-charts/internals';
import type {
  ChartSeriesDefaultized,
} from '@mui/x-charts/internals';

const defaultValueFormatter = ((v) => (v == null ? '' : String(v.value))) as ChartSeriesDefaultized<'mapShape'>['valueFormatter'];

const seriesProcessor: SeriesProcessor<'mapShape'> = ({ series, seriesOrder }, _dataset, isItemVisible) => {
  const defaultizedSeries: Record<SeriesId, ChartSeriesDefaultized<'mapShape'>> = {};

  seriesOrder.forEach((seriesId) => {
    const input = series[seriesId];
    defaultizedSeries[seriesId] = {
      labelMarkType: 'square',
      ...input,
      data: input.data ?? [],
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
