import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ScatterValueType } from '@mui/x-charts/models';
import { Chance } from 'chance';
import { Profiler } from 'react';
import Typography from '@mui/material/Typography';
import { electricityGeneration2024 } from '../dataset/electricityGeneration2024';
import { carbonEmissions2024 } from '../dataset/carbonEmissions2024';

const chance = new Chance(8);

function generateGaussianPoints(
  meanX: number,
  meanY: number,
  stdDev: number,
  count: number,
): ScatterValueType[] {
  const points: ScatterValueType[] = [];

  // Box-Muller transform for Gaussian random numbers
  function gaussianRandom(): number {
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
  // series: [{ data: generateGaussianPoints(0, 0, 1, dataPoints / 2), label: 'A', markerSize: 1, }, { data: generateGaussianPoints(5, 5, 1, dataPoints / 2), label: 'B', markerSize: 1, },],
  series: Object.entries(electricityGeneration2024).map(
    ([countryCode, electricity]) => ({
      data: electricity.map((value, index) => ({
        x: (value * 3600) / 1000,
        y: carbonEmissions2024[countryCode][index],
      })),
      markerSize: 1,
      label: countryCode,
    }),
  ),
  xAxis: [{ min: 0, label: 'Electricity Generation (GWh)' }],
  yAxis: [{ min: 0, width: 60, label: 'Life-cycle Carbon Intensity (gCO₂eq/kWh)' }],
  height: 400,
} as const;

const MemoScatterChart = React.memo(ScatterChart);

const ProfiledScatterChart = React.memo(function ProfiledScatterChart(props: {
  onRender: React.ProfilerOnRenderCallback;
}) {
  return (
    <Profiler id="ScatterFastRenderer" onRender={props.onRender}>
      <MemoScatterChart {...scatterChartsParams} useFastRenderer />
    </Profiler>
  );
});

export default function ScatterFastRenderer() {
  const [data, setData] = React.useState<number | null>(null);

  const onRender: React.ProfilerOnRenderCallback = React.useCallback(
    (id, phase, actualDuration) => {
      setData(actualDuration);
    },
    [],
  );

  return (
    <Stack spacing={{ xs: 0, md: 4 }} sx={{ width: '100%' }}>
      <ProfiledScatterChart onRender={onRender} />
      <Typography sx={{ alignSelf: 'center' }}>
        Render time: {data?.toFixed(0)}ms
      </Typography>
    </Stack>
  );
}
