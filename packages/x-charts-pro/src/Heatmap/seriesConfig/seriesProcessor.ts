import { type SeriesProcessor, type SeriesId } from '@mui/x-charts/internals';
import { type DefaultizedHeatmapSeriesType, HeatmapData } from '../../models/seriesType/heatmap';

const seriesProcessor: SeriesProcessor<'heatmap'> = (params) => {
  const { series, seriesOrder } = params;

  const defaultizedSeries: Record<SeriesId, DefaultizedHeatmapSeriesType> = {};
  Object.keys(series).forEach((seriesId) => {
    const data = series[seriesId].data ?? [];
    const heatmapData = new HeatmapData(data);

    defaultizedSeries[seriesId] = {
      // Defaultize the data and the value formatter.
      valueFormatter: (v) => v?.toString() ?? null,
      data,
      labelMarkType: 'square',
      ...series[seriesId],
      heatmapData,
    };
  });

  return {
    series: defaultizedSeries,
    seriesOrder,
  };
};

export default seriesProcessor;
