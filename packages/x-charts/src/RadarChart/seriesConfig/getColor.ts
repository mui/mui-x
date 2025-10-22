import { ColorProcessor } from '../../internals/plugins/models/seriesConfig';
import { getSeriesColorFn } from '../../internals/getSeriesColorFn';

const getColor: ColorProcessor<'radar'> = (series) => {
  return getSeriesColorFn(series.color);
};

export default getColor;
