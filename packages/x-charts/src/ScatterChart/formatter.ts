import defaultizeCartesianSeries from '../internals/defaultizeCartesianSeries';
import defaultizeValueFormatter from '../internals/defaultizeValueFormatter';
import { Formatter } from '../models/seriesType/config';

const formatter: Formatter<'scatter'> = ({ series, seriesOrder }) => {
  return {
    series: defaultizeValueFormatter(defaultizeCartesianSeries(series), (v) => `(${v.x}, ${v.y})`),
    seriesOrder,
  };
};

export default formatter;
