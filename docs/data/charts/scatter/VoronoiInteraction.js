import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const data = [
  { x1: 529.39, y1: 643.28, x2: 191.29, y2: -46.1, id: 'data-0' },
  { x1: 296.94, y1: 310.5, x2: -60.4, y2: 17.8, id: 'data-1' },
  { x1: 536.35, y1: 375.23, x2: 82.34, y2: 86.32, id: 'data-2' },
  { x1: 359.44, y1: 395.97, x2: 184.85, y2: 125.12, id: 'data-3' },
  { x1: 388.86, y1: 551.77, x2: -17.73, y2: -55.42, id: 'data-4' },
  { x1: 343.86, y1: 243.25, x2: 160.22, y2: -53.49, id: 'data-5' },
  { x1: 402.02, y1: 576.34, x2: 9.5, y2: 109.69, id: 'data-6' },
  { x1: 584.41, y1: 231.51, x2: 58.93, y2: 36.38, id: 'data-7' },
  { x1: 456.76, y1: 431.31, x2: -129.43, y2: 240.72, id: 'data-8' },
  { x1: 343.79, y1: 308.04, x2: 219.02, y2: -179.71, id: 'data-9' },
  { x1: 303.48, y1: 521.77, x2: -184.11, y2: 284.17, id: 'data-10' },
  { x1: 472.39, y1: 320.18, x2: -10.97, y2: -145.04, id: 'data-11' },
  { x1: 223.57, y1: 566.2, x2: 256.4, y2: 218.5, id: 'data-12' },
  { x1: 419.73, y1: 651.45, x2: 35.96, y2: -18.68, id: 'data-13' },
  { x1: 254.99, y1: 494.8, x2: 234.5, y2: 240.9, id: 'data-14' },
  { x1: 334.13, y1: 321.83, x2: 183.8, y2: 73.52, id: 'data-15' },
  { x1: 212.7, y1: 487.7, x2: 70.8, y2: 146.7, id: 'data-16' },
  { x1: 376.51, y1: 334.06, x2: -80.83, y2: -125.47, id: 'data-17' },
  { x1: 265.05, y1: 304.5, x2: -121.07, y2: -49.1, id: 'data-18' },
  { x1: 362.25, y1: 613.07, x2: -136.29, y2: -173.52, id: 'data-19' },
  { x1: 268.88, y1: 274.68, x2: -49.2, y2: 133.2, id: 'data-20' },
  { x1: 295.29, y1: 560.6, x2: 129.1, y2: 222, id: 'data-21' },
  { x1: 590.62, y1: 530.72, x2: -189.99, y2: 288.06, id: 'data-22' },
];

export default function VoronoiInteraction() {
  const [voronoiMaxRadius, setVoronoiMaxRadius] = React.useState(25);
  const [disableVoronoi, setDisableVoronoi] = React.useState(false);
  const [undefinedRadius, setUndefinedRadius] = React.useState(true);

  const handleMaxRadiusChange = (event, newValue) => {
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
