import { ColorProcessor } from '@mui/x-charts/internals';

const getColor: ColorProcessor<'funnel'> = (series) => {
  return (dataIndex: number) => series.data[dataIndex].color;
};

export default getColor;
