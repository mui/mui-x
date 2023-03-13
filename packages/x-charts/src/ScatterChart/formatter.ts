import defaultizeCartesianSeries from '../internals/defaultizeCartesianSeries';
import { ScatterSeriesType } from '../models/seriesType';

export type FormatterParams = {
  series: { [id: string]: ScatterSeriesType };
  seriesOrder: string[];
};

export type FormatterResult = {
  series: { [id: string]: ScatterSeriesType };
  seriesOrder: string[];
};

const formatter = ({ series, seriesOrder }: FormatterParams): FormatterResult => {
  return { series: defaultizeCartesianSeries(series), seriesOrder };
};

export default formatter;
