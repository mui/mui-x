import { LineChart } from '@mui/x-charts/LineChart';

const xData = [1, 2, 3, 5, 8, 10];
const yData = [2, 5.5, 2, 8.5, 1.5, 5];

export default function BasicArea() {
  return (
    <LineChart
      xAxis={[{ data: xData }]}
      series={[
        {
          data: yData,
          area: true,
          showMark: true,
        },
      ]}
      height={300}
    />
  );
}
