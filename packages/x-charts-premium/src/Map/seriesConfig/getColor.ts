import type { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'mapShape'> = (series) => {
  return (dataIndex?: number) => {
    if (dataIndex == null) {
      return series.color;
    }
    return series.data[dataIndex].color ?? series.color;
  };
};

export default getColor;
