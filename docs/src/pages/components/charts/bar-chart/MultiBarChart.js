import * as React from 'react';
import BarChart from '@mui/charts/BarChart';
import Bar from '@mui/charts/Bar';
import XAxis from '@mui/charts/XAxis';
import YAxis from '@mui/charts/YAxis';
import Grid from '@mui/charts/Grid';
import Tooltip from '@mui/charts/Tooltip';
import Legend from '@mui/charts/Legend';

async function getData() {
  const response = await fetch(
    'https://api.github.com/repos/mui-org/material-ui/stats/punch_card',
  );
  const rawData = await response.json();

  const morningDataPoints = {};
  const afternoonDataPoints = {};
  const nightDataPoints = {};

  rawData.forEach((record) => {
    const day = record[0];
    const hour = record[1];
    const commitCount = record[2];

    if (hour >= 6 && hour < 14) {
      morningDataPoints[day] = (morningDataPoints[day] ?? 0) + commitCount;
    }

    if (hour >= 14 && hour < 22) {
      afternoonDataPoints[day] = (afternoonDataPoints[day] ?? 0) + commitCount;
    }

    if (hour >= 22 || hour < 6) {
      nightDataPoints[day] = (nightDataPoints[day] ?? 0) + commitCount;
    }
  });

  return {
    morning: Object.keys(morningDataPoints).map((day) => ({
      x: day,
      y: morningDataPoints[day],
    })),
    afternoon: Object.keys(afternoonDataPoints).map((day) => ({
      x: day,
      y: afternoonDataPoints[day],
    })),
    night: Object.keys(nightDataPoints).map((day) => ({
      x: day,
      y: nightDataPoints[day],
    })),
  };
}

export default function MultiLineChart() {
  const [chartData, setChartData] = React.useState(undefined);

  React.useEffect(() => {
    async function loadData() {
      setChartData(await getData());
    }

    loadData();
  }, []);

  return chartData ? (
    <BarChart
      data={[chartData?.morning, chartData?.afternoon, chartData?.night]}
      highlightMarkers
      invertMarkers
      label="Commits to the MUI repo by day of week"
      margin={{ top: 60, bottom: 70, left: 60 }}
      xScaleType="linear"
      padding={15}
    >
      <Grid disableX />
      <Bar series={0} label="Morning" fill="rgb(116,205,240)" />
      <Bar series={1} label="Afternoon" fill="rgb(150,219,124)" />
      <Bar series={2} label="Night" fill="rgb(234,95,95)" />
      <XAxis label="Day of week" />
      <YAxis label="Count" disableLine disableTicks />
      <Tooltip />
      <Legend spacing={80} position="bottom" />
    </BarChart>
  ) : null;
}
