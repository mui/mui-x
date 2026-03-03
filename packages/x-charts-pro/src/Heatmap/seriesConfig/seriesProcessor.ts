import { type SeriesProcessor, type SeriesId } from '@mui/x-charts/internals';
import { type DefaultizedHeatmapSeriesType } from '../../models/seriesType/heatmap';

const seriesProcessor: SeriesProcessor<'heatmap'> = (params) => {
  const { series, seriesOrder } = params;

  const defaultizedSeries: Record<SeriesId, DefaultizedHeatmapSeriesType> = {};
  Object.keys(series).forEach((seriesId) => {
    const data = series[seriesId].data ?? [];
    const valueLookup = new Map<number, Map<number, number>>();
    for (const [xIndex, yIndex, value] of data) {
      if (!valueLookup.has(xIndex)) {
        valueLookup.set(xIndex, new Map<number, number>());
      }

      if (!valueLookup.get(xIndex)!.has(yIndex)) {
        valueLookup.get(xIndex)!.set(yIndex, value);
      }
    }

    defaultizedSeries[seriesId] = {
      // Defaultize the data and the value formatter.
      valueFormatter: (v) => v?.toString() ?? null,
      data,
      labelMarkType: 'square',
      ...series[seriesId],
      valueLookup,
    };
  });

  return {
    series: defaultizedSeries,
    seriesOrder,
  };
};

export default seriesProcessor;
