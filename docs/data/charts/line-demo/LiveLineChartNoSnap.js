import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const xLabels = [
  'Page A',
  'Page B',
  'Page C',
  'Page D',
  'Page E',
  'Page F',
  'Page G',
];

const randBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

export default function LiveLineChartNoSnap() {
  const [uData, setUData] = React.useState([
    4000, 3000, 2000, 2780, 1890, 2390, 3490,
  ]);
  const [pData, setPData] = React.useState([
    2400, 1398, 9800, 3908, 4800, 3800, 4300,
  ]);

  React.useEffect(() => {
    const intervalId = setInterval(() => {
      setUData((prev) => [...prev.slice(1), randBetween(0, 5000)]);
      setPData((prev) => [...prev.slice(1), randBetween(0, 5000)]);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <LineChart
      height={300}
      series={[
        { data: pData, label: 'pv' },
        { data: uData, label: 'uv' },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      margin={{ right: 24 }}
    />
  );
}
