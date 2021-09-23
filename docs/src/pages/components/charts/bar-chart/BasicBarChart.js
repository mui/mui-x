import * as React from 'react';
import BarChart from '@mui/charts/BarChart';
import { useTheme } from '@mui/material/styles';
import Bar from '@mui/charts/Bar';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';

async function getData() {
  const response = await fetch(
    'https://api.github.com/repos/mui-org/material-ui/stats/punch_card',
  );
  const rawData = await response.json();

  const dataPoints = {};
  rawData.forEach((record) => {
    dataPoints[record[1]] = (dataPoints[record[1]] ?? 0) + record[2];
  });

  return Object.keys(dataPoints).map((hour) => ({ x: hour, y: dataPoints[hour] }));
}

export default function BasicBarChart() {
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    async function loadData() {
      setChartData(await getData());
    }

    loadData();
  }, []);

  const theme = useTheme();
  return (
    <BarChart
      data={chartData}
      xScaleType="linear"
      xDomain={[0, 23]}
      label="Commits to the MUI repo per hour of day"
      pixelsPerTick={30}
    >
      <Grid disableX />
      <XAxis />
      <YAxis />
      <Bar stroke="rgb(235,97,97)" fill={theme.palette.primary.main} />
    </BarChart>
  );
}
