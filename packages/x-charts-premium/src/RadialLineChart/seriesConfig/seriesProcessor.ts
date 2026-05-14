import { processLineLikeSeries, type SeriesProcessor } from '@mui/x-charts/internals';

const seriesProcessor: SeriesProcessor<'radialLine'> = (params, dataset, isItemVisible) =>
  processLineLikeSeries(params, dataset, isItemVisible, {
    seriesType: 'radialLine',
    errorLabel: { titleCase: 'Radial line', lowerCase: 'radial lines' },
  });

export default seriesProcessor;
