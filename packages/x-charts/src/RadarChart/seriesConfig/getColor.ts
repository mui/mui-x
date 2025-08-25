import { ColorProcessor } from '../../plugins/models/seriesConfig';

const getColor: ColorProcessor<'radar'> = (series) => {
  return () => series.color;
};

export default getColor;
