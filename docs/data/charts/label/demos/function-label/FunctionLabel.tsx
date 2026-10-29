import { BarChart } from '@mui/x-charts/BarChart';

export default function FunctionLabel() {
  return (
    // @focus-start @padding 2
    <BarChart
      {...props}
      series={[
        { data: [2400, 1398, 9800], label: 'simple label' },
        { data: [500, 2398, 4300], label: (location) => `${location} label` },
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
