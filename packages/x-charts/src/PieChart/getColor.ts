import { ColorProcessor } from '../context/PluginProvider/ColorProcessor.types';

const getColor: ColorProcessor<'pie'> = (series) => {
  return (dataIndex: number) => {
    return series.data[dataIndex].color;
  };
};

export default getColor;
