import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { BarChart } from '@mui/x-charts/BarChart';
import {
  useXAxisCoordinates,
  useXAxis,
  useYAxisCoordinates,
  useYAxis,
} from '@mui/x-charts/hooks';

export default function GroupedAxesAutoSize() {
  const [useAutoSize, setUseAutoSize] = React.useState(true);

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <FormControlLabel
          checked={useAutoSize}
          control={
            <Checkbox onChange={(event) => setUseAutoSize(event.target.checked)} />
          }
          label="Use auto-sizing"
          labelPlacement="end"
        />
      </Stack>

      <BarChart
        xAxis={[
          {
            data,
            scaleType: 'band',
            id: 'x-bottom-1',
            position: 'bottom',
            height: useAutoSize ? 'auto' : undefined,
            groups: [
              { getValue: getMonth, tickSize: 10 },
              { getValue: getQuarter, tickSize: 34 },
              { getValue: getYear, tickSize: 60 },
            ],
            valueFormatter,
          },
        ]}
        yAxis={[
          {
            id: 'y-left-1',
            position: 'left',
            valueFormatter: (value) => `${value.toFixed(0)}%`,
          },
        ]}
        height={300}
        margin={{ bottom: 0, left: 0 }}
        series={[
          {
            data: getPercents(revenue),
            label: 'Revenue',
            valueFormatter: (value) => `${(value ?? 0).toFixed(0)}%`,
          },
          {
            data: getPercents(expenses),
            label: 'Expenses',
            valueFormatter: (value) => `${(value ?? 0).toFixed(0)}%`,
          },
        ]}
      >
        <XAxisPositionIndicator axisId="x-bottom-1" color={'#e63946'} />
        <YAxisPositionIndicator axisId="y-left-1" color={'#8338ec'} />
      </BarChart>
    </Box>
  );
}

const getMonth = (date) => date.toLocaleDateString('en-US', { month: 'short' });

const getQuarter = (date) => `Q${Math.floor(date.getMonth() / 3) + 1}`;

const getYear = (date) => date.toLocaleDateString('en-US', { year: 'numeric' });

const valueFormatter = (v) =>
  v.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric',
  });

const data = [
  new Date(2014, 11, 1),
  new Date(2015, 0, 1),
  new Date(2015, 1, 1),
  new Date(2015, 2, 1),
  new Date(2015, 3, 1),
  new Date(2015, 4, 1),
  new Date(2015, 5, 1),
  new Date(2015, 6, 1),
  new Date(2015, 7, 1),
  new Date(2015, 8, 1),
  new Date(2015, 9, 1),
  new Date(2015, 10, 1),
  new Date(2015, 11, 1),
  new Date(2016, 0, 1),
];

const revenue = [
  3190, 4000, 3000, 2000, 2780, 1890, 2390, 3490, 2400, 1398, 9800, 3908, 4800, 2040,
];

const expenses = [
  1200, 2400, 1398, 9800, 3908, 4800, 3800, 4300, 2181, 2500, 2100, 3000, 2000, 2040,
];

const getPercents = (array) =>
  array.map((v, index) => (100 * v) / (revenue[index] + expenses[index]));

function XAxisPositionIndicator({ axisId, color }) {
  const xPosition = useXAxisCoordinates(axisId);
  const xAxis = useXAxis(axisId);

  if (!xPosition) {
    return null;
  }

  return (
    <AxisPositionIndicator
      position={xAxis.position ?? 'bottom'}
      coordinates={xPosition}
      color={color}
    />
  );
}

function YAxisPositionIndicator({ axisId, color }) {
  const yPosition = useYAxisCoordinates(axisId);
  const yAxis = useYAxis(axisId);

  if (!yPosition) {
    return null;
  }

  return (
    <AxisPositionIndicator
      position={yAxis.position ?? 'left'}
      coordinates={yPosition}
      color={color}
    />
  );
}

function AxisPositionIndicator({ position, coordinates, color }) {
  if (position === 'none') {
    return null;
  }

  return (
    <rect
      x={coordinates.left}
      y={coordinates.top}
      width={coordinates.right - coordinates.left}
      height={coordinates.bottom - coordinates.top}
      fill={color}
      fillOpacity={0.2}
      stroke={color}
      strokeWidth={2}
    />
  );
}
