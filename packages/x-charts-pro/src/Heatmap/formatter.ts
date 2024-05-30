import { defaultizeValueFormatter, Formatter } from '@mui/x-charts/internals';

const formatter: Formatter<'heatmap'> = ({ series, seriesOrder }) => {
  return {
    series: defaultizeValueFormatter(series, (v) => v[2].toString()),
    seriesOrder,
  };
};

export default formatter;
