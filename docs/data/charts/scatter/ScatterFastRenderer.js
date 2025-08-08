import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

import { Chance } from 'chance';
import { Profiler } from 'react';
import Typography from '@mui/material/Typography';

const chance = new Chance(8);

function generateGaussianPoints(meanX, meanY, stdDev, count) {
  const points = [];

  // Box-Muller transform for Gaussian random numbers
  function gaussianRandom() {
    let u = 0;
    let v = 0;
    while (u === 0) {
      u = chance.floating({ min: 0, max: 1 });
    } // Converting [0,1) to (0,1)
    while (v === 0) {
      v = chance.floating({ min: 0, max: 1 });
    }
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  }

  for (let i = 0; i < count; i += 1) {
    const x = meanX + gaussianRandom() * stdDev;
    const y = meanY + gaussianRandom() * stdDev;
    points.push({ x, y });
  }

  return points;
}

const dataPoints = 10_000;
const scatterChartsParams = {
  series: [
    {
      data: generateGaussianPoints(0, 0, 1, dataPoints / 2),
      label: 'A',
      markerSize: 1,
    },
    {
      data: generateGaussianPoints(5, 5, 1, dataPoints / 2),
      label: 'B',
      markerSize: 1,
    },
  ],
  yAxis: [{ width: 24 }],
  height: 400,
};

const MemoScatterChart = React.memo(ScatterChart);

const ProfiledScatterChart = React.memo(function ProfiledScatterChart(props) {
  return (
    <Profiler id="ScatterFastRenderer" onRender={props.onRender}>
      <MemoScatterChart {...scatterChartsParams} useFastRenderer />
    </Profiler>
  );
});

export default function ScatterFastRenderer() {
  const [data, setData] = React.useState(null);

  const onRender = React.useCallback((id, phase, actualDuration) => {
    setData(actualDuration);
  }, []);

  return (
    <Stack spacing={{ xs: 0, md: 4 }} sx={{ width: '100%' }}>
      <ProfiledScatterChart onRender={onRender} />
      <Typography sx={{ alignSelf: 'center' }}>
        Render time: {data?.toFixed(0)}ms
      </Typography>
    </Stack>
  );
}
