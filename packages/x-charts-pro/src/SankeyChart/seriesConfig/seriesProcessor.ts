import { SeriesProcessor, SeriesId } from '@mui/x-charts/internals';
import { DefaultizedSankeySeriesType, SankeyValueFormatterContext } from '../sankey.types';

type SankeyValueFormatter = (value: number, context: SankeyValueFormatterContext) => string | null;

const defaultSankeyValueFormatter: SankeyValueFormatter = (v) =>
  v == null ? '' : v.toLocaleString();

function defaultizeSankeyValueFormatter(
  series: Record<SeriesId, DefaultizedSankeySeriesType>,
  defaultFormatter: SankeyValueFormatter,
): Record<SeriesId, DefaultizedSankeySeriesType & { valueFormatter: SankeyValueFormatter }> {
  const defaultizedSeries: Record<
    SeriesId,
    DefaultizedSankeySeriesType & { valueFormatter: SankeyValueFormatter }
  > = {};

  Object.keys(series).forEach((seriesId) => {
    defaultizedSeries[seriesId] = {
      ...series[seriesId],
      valueFormatter: series[seriesId].valueFormatter ?? defaultFormatter,
    };
  });

  return defaultizedSeries;
}

export const seriesProcessor: SeriesProcessor<'sankey'> = (params) => {
  const { seriesOrder, series } = params;

  return {
    seriesOrder,
    series: defaultizeSankeyValueFormatter(series, defaultSankeyValueFormatter),
  };
};
