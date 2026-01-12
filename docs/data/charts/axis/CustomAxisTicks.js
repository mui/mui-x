import { BarChart } from '@mui/x-charts/BarChart';
import { useXAxisTicks } from '@mui/x-charts/hooks';

const labels = [
  'Server Products',
  'Enterprise Services',
  'M365 Commercial',
  'M365 Consumer',
  'LinkedIn',
  'Dynamics',
  'Gaming',
  'Windows & Devices',
  'Search & News Ads',
];

const data = [98.4, 7.7, 87.7, 7.4, 17.8, 7.8, 23.4, 17.3, 13.8];

const chartSetting = {
  height: 400,
  margin: { left: 0 },
  layout: 'horizontal',
  xAxis: [{ id: 'x' }],
  yAxis: [{ id: 'y', scaleType: 'band', data: labels }],
  series: [{ data }],
};

export default function CustomAxisTicks() {
  return <BarChart {...chartSetting} slots={{ axisTicks: AxisTicks }} />;
}

function AxisTicks() {
  console.log(useXAxisTicks('x'));
  return null;
}
