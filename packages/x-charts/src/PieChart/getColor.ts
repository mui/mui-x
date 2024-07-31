import { DefaultizedPieSeriesType } from '../models/seriesType/pie';
import { ColorProcessor } from '../context/PluginProvider/ColorProcessor.types';

const getColor: ColorProcessor<'pie'> = (series: DefaultizedPieSeriesType) => {
  return (dataIndex: number) => {
    return series.data[dataIndex].color;
  };
};

export default getColor;
