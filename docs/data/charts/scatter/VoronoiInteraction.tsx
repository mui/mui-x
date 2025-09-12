import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import data from '../dataset/random/scatterParallel.json';

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
        dataset={data}
        series={[
          {
            label: 'Series A',
            data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
          },
          {
            label: 'Series B',
            data: data.map((v) => ({ x: v.x2, y: v.y2, id: v.id })),
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
