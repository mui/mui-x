import { defaultizeValueFormatter } from '../../internals/defaultizeValueFormatter';
import { SeriesProcessor } from '../../internals/plugins/models/seriesConfig';

const formatter: SeriesProcessor<'radar'> = (params) => {
  const { seriesOrder, series } = params;

  return {
    seriesOrder,
    series: defaultizeValueFormatter(series, (v) => (v == null ? '' : v.toLocaleString())),
  };
};

export default formatter;
