import defaultizeCartesianSeries from '../internals/defaultizeCartesianSeries';
import { Formatter } from '../models/seriesType/config';

const formatter: Formatter<'scatter'> = ({ series, seriesOrder }) => {
  return { series: defaultizeCartesianSeries(series), seriesOrder };
};

export default formatter;
