import { SeriesFormatter, SeriesId } from '@mui/x-charts/internals';
import { DefaultizedHeatmapSeriesType } from '../models/seriesType/heatmap';

const formatter: SeriesFormatter<'heatmap'> = (params) => {
  const { series, seriesOrder } = params;

  const defaultizedSeries: Record<SeriesId, DefaultizedHeatmapSeriesType> = {};
  Object.keys(series).forEach((seriesId) => {
    defaultizedSeries[seriesId] = {
      // Defaultize the data and the value formatter.
      valueFormatter: (v) => v[2].toString(),
      data: [],
      ...series[seriesId],
    };
  });

  return {
    series: defaultizedSeries,
    seriesOrder,
  };
};

export default formatter;
