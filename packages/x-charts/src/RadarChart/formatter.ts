import { defaultizeValueFormatter } from '../internals/defaultizeValueFormatter';
import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';

// For now it's a copy past of bar charts formatter, but maybe will diverge later
const formatter: SeriesFormatter<'radar'> = (params) => {
  const { seriesOrder, series } = params;

  return {
    seriesOrder,
    series: defaultizeValueFormatter(series, (v) => (v == null ? '' : v.toLocaleString())),
  };
};

export default formatter;
