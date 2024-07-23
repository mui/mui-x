import * as React from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import useId from '@mui/utils/useId';

import { ResponsiveChartContainer } from '@mui/x-charts/ResponsiveChartContainer';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartsClipPath } from '@mui/x-charts/ChartsClipPath';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsGrid } from '@mui/x-charts/ChartsGrid';

import { Chance } from 'chance';

const chance = new Chance(42);

const data = Array.from({ length: 100 }, () => ({
  x: chance.floating({ min: -25, max: 25 }),
  y: chance.floating({ min: -25, max: 25 }),
})).map((d, index) => ({ ...d, id: index }));

const minDistance = 10;

export default function LimitOverflow() {
  const [isLimited, setIsLimited] = React.useState(false);
  const [xLimits, setXLimites] = React.useState([-20, 20]);

  const id = useId();
  const clipPathId = `${id}-clip-path`;

  const handleChange = (event, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance);
        setXLimites([clamped, clamped + minDistance]);
      } else {
        const clamped = Math.max(newValue[1], minDistance);
        setXLimites([clamped - minDistance, clamped]);
      }
    } else {
      setXLimites(newValue);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 500 }}>
      <FormControlLabel
        checked={isLimited}
        control={
          <Checkbox onChange={(event) => setIsLimited(event.target.checked)} />
        }
        label="Clip the plot"
        labelPlacement="end"
      />
      <ResponsiveChartContainer
        xAxis={[
          {
            label: 'x',
            min: xLimits[0],
            max: xLimits[1],
            data: [-30, -25, -20, -15, -10, -5, 0, 5, 10, 15, 20, 25],
          },
        ]}
        series={[
          { type: 'scatter', data, markerSize: 8 },
          {
            type: 'line',
            data: [10, 13, 12, 5, -6, -3, 4, 20, 18, 17, 12, 11],
            showMark: true,
          },
        ]}
        height={300}
        margin={{ top: 10 }}
      >
        <ChartsGrid vertical horizontal />
        <g clipPath={`url(#${clipPathId})`}>
          <ScatterPlot />
          <LinePlot />
        </g>
        <ChartsXAxis />
        <ChartsYAxis />
        <MarkPlot />
        {isLimited && <ChartsClipPath id={clipPathId} />}
      </ResponsiveChartContainer>

      <Slider
        value={xLimits}
        onChange={handleChange}
        valueLabelDisplay="auto"
        min={-40}
        max={40}
        sx={{ mt: 2 }}
      />
    </Box>
  );
}
