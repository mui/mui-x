import defaultizeValueFormatter from '../internals/defaultizeValueFormatter';
import { Formatter } from '../models/seriesType/config';

const formatter: Formatter<'scatter'> = ({ series, seriesOrder }) => {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    series: defaultizeValueFormatter(series, (v, _) => `(${v.x}, ${v.y})`),
    seriesOrder,
  };
};

export default formatter;
