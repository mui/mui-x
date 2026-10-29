import { BarChart } from '@mui/x-charts/BarChart';

export default function BasicLabel() {
  return (
    // @focus-start @padding 2
    <BarChart
      {...props}
      series={[
        {
          data: [2400, 1398, 9800],
          label: 'label 1',
        },
      ]}
    />
    // @focus-end
  );
}

const props = {
  height: 300,
  xAxis: [{ data: ['A', 'B', 'C'] }],
  yAxis: [{ width: 50 }],
};
