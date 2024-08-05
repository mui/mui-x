import { defaultizeValueFormatter } from '../internals/defaultizeValueFormatter';
import { SeriesFormatter } from '../context/PluginProvider/SeriesFormatter.types';

const formatter: SeriesFormatter<'scatter'> = ({ series, seriesOrder }) => {
  return {
    series: defaultizeValueFormatter(series, (v) => `(${v.x}, ${v.y})`),
    seriesOrder,
  };
};

export default formatter;
