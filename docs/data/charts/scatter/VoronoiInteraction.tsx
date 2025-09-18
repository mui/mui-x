/* eslint-disable no-nested-ternary */

import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import data from '../dataset/random/scatterParallel.json';

export default function VoronoiInteraction() {
  const [option, setOption] = React.useState<'item' | 'undefined' | 'numeric'>(
    'numeric',
  );
  const [voronoiMaxRadius, setVoronoiMaxRadius] = React.useState<number>(25);

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
        voronoiMaxRadius={
          option === 'undefined'
            ? undefined
            : option === 'item'
              ? 'item'
              : voronoiMaxRadius
        }
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
        <Typography gutterBottom>Maximum radius</Typography>
        <RadioGroup
          onChange={(event) =>
            setOption(event.target.value as 'item' | 'undefined' | 'numeric')
          }
        >
          <Stack direction="row">
            <FormControlLabel
              checked={option === 'item'}
              control={<Radio />}
              label="'item'"
              labelPlacement="end"
              value="item"
            />
            <FormControlLabel
              checked={option === 'undefined'}
              control={<Radio />}
              label="undefined"
              labelPlacement="end"
              value="undefined"
            />
            <FormControlLabel
              checked={option === 'numeric'}
              control={<Radio />}
              label="numeric radius"
              labelPlacement="end"
              value="numeric"
            />
          </Stack>
        </RadioGroup>

        <Typography id="max-radius-value" gutterBottom>
          Numeric radius
        </Typography>
        <Slider
          value={voronoiMaxRadius}
          onChange={handleMaxRadiusChange}
          valueLabelDisplay="auto"
          min={1}
          max={100}
          aria-labelledby="max-radius-value"
          disabled={option !== 'numeric'}
        />
      </div>
    </Stack>
  );
}
