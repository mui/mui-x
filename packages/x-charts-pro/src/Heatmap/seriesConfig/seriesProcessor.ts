import { type SeriesProcessor, type SeriesId } from '@mui/x-charts/internals';
import { type DefaultizedHeatmapSeriesType } from '../../models/seriesType/heatmap';

const seriesProcessor: SeriesProcessor<'heatmap'> = (params) => {
  const { series, seriesOrder } = params;

  const defaultizedSeries: Record<SeriesId, DefaultizedHeatmapSeriesType> = {};
  Object.keys(series).forEach((seriesId) => {

    const data = series[seriesId].data ?? []
    const dataIndexLookup = new Map<number, Map<number, number>>();
    (data).forEach((value, dataIndex) => {
      const xIndex = value[0];
      const yIndex = value[1];

      if (!dataIndexLookup.has(xIndex)) {
        dataIndexLookup.set(xIndex, new Map<number, number>());
      }
      if (!dataIndexLookup.get(xIndex)!.has(yIndex)) {
        dataIndexLookup.get(xIndex)!.set(yIndex, dataIndex);
      }
    });

    defaultizedSeries[seriesId] = {
      // Defaultize the data and the value formatter.
      valueFormatter: (v) => v[2].toString(),
      data,
      labelMarkType: 'square',
      ...series[seriesId],
      dataIndexLookup,
    };
  });

  return {
    series: defaultizedSeries,
    seriesOrder,
  };
};

export default seriesProcessor;
