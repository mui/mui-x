import { processLineLikeSeries } from '../../internals/processLineLikeSeries';
import { type SeriesProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const seriesProcessor: SeriesProcessor<'line'> = (params, dataset, isItemVisible) =>
  processLineLikeSeries(params, dataset, isItemVisible, 'line');

export default seriesProcessor;
