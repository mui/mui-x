import { defaultizeValueFormatter } from '../internals/defaultizeValueFormatter';
import { Formatter } from '../models/seriesType/config';

const formatter: Formatter<'scatter'> = ({ series, seriesOrder }) => {
  return {
    series: defaultizeValueFormatter(series, (v) => `(${v.x}, ${v.y})`),
    seriesOrder,
  };
};

export default formatter;
