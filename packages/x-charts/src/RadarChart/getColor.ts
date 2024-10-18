import { ColorProcessor } from '../context/PluginProvider/ColorProcessor.types';

const getColor: ColorProcessor<'radar'> = (series) => {
  return () => series.color;
};

export default getColor;
