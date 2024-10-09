import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import {
  spaceWalksRussiaScatter,
  spaceWalksUSAScatter,
} from '../dataset/spaceWalks';
import {
  heavyLaunchesScatter,
  mediumLaunchesScatter,
  smallLaunchesScatter,
} from '../dataset/spaceLaunchesCost';
import { possibleAsteroidImpactProbabilityBySizeScatter } from '../dataset/possibleAsteroidImpact';
import { starsScatterMagnitudeByTemperatureByType } from '../dataset/starClassification';
import { lifeExpectancyScatterSeries } from '../dataset/lifeExpectancyVsGdp';
import { volcanoEruptionsScatterSeries } from '../dataset/volcanoEruptions';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function VoronoiInteraction() {
  const [voronoiMaxRadius, setVoronoiMaxRadius] = React.useState<number>(25);
  const [disableVoronoi, setDisableVoronoi] = React.useState<boolean>(false);
  const [undefinedRadius, setUndefinedRadius] = React.useState<boolean>(true);

  const handleMaxRadiusChange = (event: Event, newValue: number | number[]) => {
    if (typeof newValue !== 'number') {
      return;
    }
    setVoronoiMaxRadius(newValue);
  };

  return (
    <Stack direction="column" sx={{ width: '100%' }}>
      <ScatterChart
        height={300}
        disableVoronoi={disableVoronoi}
        voronoiMaxRadius={undefinedRadius ? undefined : voronoiMaxRadius}
        margin={{ left: 60 }}
        yAxis={[
          {
            label: 'longest eruption duration',
            // valueFormatter: (value) => `${value} years`,
          },
        ]}
        xAxis={[
          {
            scaleType: 'log',
            label: 'times erupted',
            // max: 200_000,
            // min: 500,
            // valueFormatter: formatter.format,
          },
        ]}
        series={volcanoEruptionsScatterSeries}
      />
      <ScatterChart
        height={300}
        disableVoronoi={disableVoronoi}
        voronoiMaxRadius={undefinedRadius ? undefined : voronoiMaxRadius}
        margin={{ left: 60 }}
        yAxis={[
          {
            label: 'Life expectancy at birth',
            valueFormatter: (value) => `${value} years`,
          },
        ]}
        xAxis={[
          {
            scaleType: 'log',
            label: 'GDP per capita',
            max: 200_000,
            min: 500,
            valueFormatter: formatter.format,
          },
        ]}
        series={lifeExpectancyScatterSeries}
      />
      <ScatterChart
        height={400}
        disableVoronoi={disableVoronoi}
        voronoiMaxRadius={undefinedRadius ? undefined : voronoiMaxRadius}
        yAxis={[{ label: 'Absolute Magnitude', reverse: true }]}
        xAxis={[
          {
            label: 'Temperature (K)',
            valueFormatter: (value) => `${value} K`,
            reverse: true,
          },
        ]}
        series={starsScatterMagnitudeByTemperatureByType}
      />
      <ScatterChart
        height={300}
        disableVoronoi={disableVoronoi}
        voronoiMaxRadius={undefinedRadius ? undefined : voronoiMaxRadius}
        slotProps={{ legend: { hidden: true } }}
        yAxis={[{ scaleType: 'log', label: 'Cumulative Impact Probability' }]}
        xAxis={[
          {
            scaleType: 'log',
            label: 'Diameter',
            valueFormatter: (value) =>
              value < 1 ? `${value * 1000}m` : `${value} km`,
          },
        ]}
        series={[
          {
            label: 'Asteroid',
            data: possibleAsteroidImpactProbabilityBySizeScatter,
          },
        ]}
      />
      <ScatterChart
        height={300}
        disableVoronoi={disableVoronoi}
        voronoiMaxRadius={undefinedRadius ? undefined : voronoiMaxRadius}
        yAxis={[{ scaleType: 'log', label: 'Cost (USD)', max: 200_000 }]}
        xAxis={[
          {
            scaleType: 'linear',
            label: 'Year',
            valueFormatter: (value) => `${value}`,
          },
        ]}
        series={[
          {
            label: 'Small',
            data: smallLaunchesScatter,
          },
          {
            label: 'Medium',
            data: mediumLaunchesScatter,
          },
          {
            label: 'Heavy',
            data: heavyLaunchesScatter,
          },
        ]}
      />
      <ScatterChart
        height={300}
        disableVoronoi={disableVoronoi}
        voronoiMaxRadius={undefinedRadius ? undefined : voronoiMaxRadius}
        yAxis={[
          {
            label: 'Duration',
            tickInterval: [0, 60, 120, 180, 240, 300, 360, 420, 480, 540, 600],
            valueFormatter: (value) => `${value / 60} h`,
          },
        ]}
        xAxis={[
          {
            label: 'Year',
            valueFormatter: (value) => `${new Date(value).getFullYear()}`,
          },
        ]}
        series={[
          {
            label: 'Russia',
            data: spaceWalksRussiaScatter,
          },
          {
            label: 'USA',
            data: spaceWalksUSAScatter,
          },
        ]}
      />
      <div>
        <Typography id="max-radius-value" gutterBottom>
          max radius
        </Typography>
        <Slider
          value={voronoiMaxRadius}
          onChange={handleMaxRadiusChange}
          valueLabelDisplay="auto"
          min={1}
          max={100}
          aria-labelledby="max-radius-value"
          disabled={disableVoronoi || undefinedRadius}
        />
      </div>
      <Stack direction="row">
        <FormControlLabel
          checked={disableVoronoi}
          control={
            <Checkbox
              onChange={(event) => setDisableVoronoi(event.target.checked)}
            />
          }
          label="disableVoronoi"
          labelPlacement="end"
        />
        <FormControlLabel
          checked={undefinedRadius}
          control={
            <Checkbox
              onChange={(event) => setUndefinedRadius(event.target.checked)}
            />
          }
          label="undefined radius"
          labelPlacement="end"
        />
      </Stack>
    </Stack>
  );
}
