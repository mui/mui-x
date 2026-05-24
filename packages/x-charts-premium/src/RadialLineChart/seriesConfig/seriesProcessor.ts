import { processLineLikeSeries, type SeriesProcessor } from '@mui/x-charts/internals';

const seriesProcessor: SeriesProcessor<'radialLine'> = (params, dataset, isItemVisible) =>
  processLineLikeSeries(params, dataset, isItemVisible, 'radialLine');

export default seriesProcessor;
