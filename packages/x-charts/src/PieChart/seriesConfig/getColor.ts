import { ColorProcessor } from '../../internals/plugins/models';

const getColor: ColorProcessor<'pie'> = (series) => {
  return (dataIndex: number) => {
    return series.data[dataIndex].color;
  };
};

export default getColor;
