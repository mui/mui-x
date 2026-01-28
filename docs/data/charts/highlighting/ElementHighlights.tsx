import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { BarChart } from '@mui/x-charts/BarChart';
import { AnimatedLineProps, LineChart } from '@mui/x-charts/LineChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { HighlightScope } from '@mui/x-charts/context';
import scatterDataset from '../dataset/random/scatterParallel.json';

const barChartsParams = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'A' },
    { data: [4, 3, 1, 5, 8], label: 'B' },
    { data: [4, 2, 5, 4, 1], label: 'C' },
  ],
  height: 400,
};
const lineChartsParams = {
  series: [
    { data: [3, 4, 1, 6, 5], label: 'A', area: false, stack: 'total' },
    { data: [4, 3, 1, 5, 8], label: 'B', area: false, stack: 'total' },
    { data: [4, 2, 5, 4, 1], label: 'C', area: false, stack: 'total' },
  ],
  xAxis: [{ data: [1, 2, 3, 4, 5], type: 'linear' }],
  height: 400,
};

const scatterChartsParams = {
  dataset: scatterDataset,
  series: [
    { datasetKeys: { id: 'id', x: 'x1', y: 'y1' }, label: 'A' },
    { datasetKeys: { id: 'id', x: 'x2', y: 'y2' }, label: 'B' },
  ],
  height: 400,
};

const pieChartsParams = {
  series: [
    {
      data: [{ value: 5 }, { value: 10 }, { value: 15 }],
      label: 'Series 1',
      outerRadius: 80,
      highlight: { additionalRadius: 10 },
    },
    {
      data: [{ value: 5 }, { value: 10 }, { value: 15 }],
      label: 'Series 1',
      innerRadius: 90,
      highlight: { additionalRadius: 10 },
    },
  ],
  height: 400,
  margin: { top: 50, bottom: 50 },
};

function CustomLine(props: AnimatedLineProps) {
  const { d, ownerState, className, ...other } = props;

  return (
    <React.Fragment>
      <path
        d={d}
        stroke={
          ownerState.gradientId ? `url(#${ownerState.gradientId})` : ownerState.color
        }
        strokeWidth={ownerState.isHighlighted ? 4 : 2}
        strokeLinejoin="round"
        fill="none"
        filter={ownerState.isHighlighted ? 'brightness(120%)' : undefined}
        opacity={ownerState.isFaded ? 0.3 : 1}
        className={className}
      />
      <path d={d} stroke="transparent" strokeWidth={25} fill="none" {...other} />
    </React.Fragment>
  );
}

export default function ElementHighlights() {
  const [chartType, setChartType] = React.useState('bar');
  const [withArea, setWithArea] = React.useState(false);
  const [highlight, setHighlight] = React.useState('item');
  const [fade, setFade] = React.useState('global');

  const handleChartType = (event: any, newChartType: string) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  return (
    <Stack
      direction={{ xs: 'column', xl: 'row' }}
      spacing={1}
      sx={{ width: '100%' }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={handleChartType}
          aria-label="chart type"
          fullWidth
        >
          {['bar', 'line', 'scatter', 'pie'].map((type) => (
            <ToggleButton key={type} value={type}>
              {type}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        {chartType === 'bar' && (
          <BarChart
            {...barChartsParams}
            series={barChartsParams.series.map((series) => ({
              ...series,
              highlightScope: {
                highlight,
                fade,
              } as HighlightScope,
            }))}
          />
        )}

        {chartType === 'line' && (
          <LineChart
            {...lineChartsParams}
            series={lineChartsParams.series.map((series) => ({
              ...series,
              area: withArea,
              highlightScope: {
                highlight,
                fade,
              } as HighlightScope,
            }))}
            slots={withArea ? {} : { line: CustomLine }}
          />
        )}

        {chartType === 'scatter' && (
          <ScatterChart
            {...scatterChartsParams}
            series={scatterChartsParams.series.map((series) => ({
              ...series,
              highlightScope: {
                highlight,
                fade,
              } as HighlightScope,
            }))}
          />
        )}

        {chartType === 'pie' && (
          <PieChart
            {...pieChartsParams}
            series={pieChartsParams.series.map((series) => ({
              ...series,
              highlightScope: {
                highlight,
                fade,
              } as HighlightScope,
            }))}
          />
        )}
      </Box>
      <Stack
        direction={{ xs: 'row', xl: 'column' }}
        spacing={3}
        justifyContent="center"
        flexWrap="wrap"
        useFlexGap
      >
        <TextField
          select
          label="highlight"
          value={highlight}
          onChange={(event) => setHighlight(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'item'}>item</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
        </TextField>
        <TextField
          select
          label="fade"
          value={fade}
          onChange={(event) => setFade(event.target.value)}
          sx={{ minWidth: 150 }}
        >
          <MenuItem value={'none'}>none</MenuItem>
          <MenuItem value={'series'}>series</MenuItem>
          <MenuItem value={'global'}>global</MenuItem>
        </TextField>
        {chartType === 'line' && (
          <FormControlLabel
            control={
              <Switch
                checked={withArea}
                onChange={(event) => setWithArea(event.target.checked)}
              />
            }
            label="Fill line area"
          />
        )}
      </Stack>
    </Stack>
  );
}
