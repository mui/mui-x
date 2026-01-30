import { type ColorProcessor } from '../../internals/plugins/corePlugins/useChartSeriesConfig';

const getColor: ColorProcessor<'pie'> = (series) => {
  return (dataIndex: number) => {
    return series.data[dataIndex].color;
  };
};

export default getColor;
