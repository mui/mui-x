import { ColorProcessor } from '../../internals/plugins/models/seriesConfig';

const getColor: ColorProcessor<'radar'> = (series) => {
  return () => series.color;
};

export default getColor;
