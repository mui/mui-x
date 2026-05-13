import { BarChart } from '@mui/x-charts/BarChart';

const dataset = [
  { month: 'Jan', london: 59, paris: 57 },
  { month: 'Feb', london: 50, paris: 52 },
  { month: 'Mar', london: 47, paris: 53 },
  { month: 'Apr', london: 54, paris: 56 },
  { month: 'May', london: 57, paris: 69 },
  { month: 'June', london: 60, paris: 63 },
  { month: 'July', london: 59, paris: 60 },
  { month: 'Aug', london: 65, paris: 60 },
  { month: 'Sept', london: 51, paris: 51 },
  { month: 'Oct', london: 60, paris: 65 },
  { month: 'Nov', london: 67, paris: 64 },
  { month: 'Dec', london: 61, paris: 70 },
];

export default function DatasetBasic() {
  return (
    <BarChart
      dataset={dataset}
      xAxis={[{ dataKey: 'month', scaleType: 'band' }]}
      series={[
        { dataKey: 'london', label: 'London' },
        { dataKey: 'paris', label: 'Paris' },
      ]}
      height={300}
    />
  );
}
