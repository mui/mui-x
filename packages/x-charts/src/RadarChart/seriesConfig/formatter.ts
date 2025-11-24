import { defaultizeValueFormatter } from '../../internals/defaultizeValueFormatter';
import { SeriesProcessorWithoutDimensions } from '../../internals/plugins/models/seriesConfig';

const formatter: SeriesProcessorWithoutDimensions<'radar'> = (params) => {
  const { seriesOrder, series } = params;

  return {
    seriesOrder,
    series: defaultizeValueFormatter(series, (v) => (v == null ? '' : v.toLocaleString())),
  };
};

export default formatter;
