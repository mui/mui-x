import * as React from 'react';
import Stack from '@mui/material/Stack';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { LinePlot, MarkPlot } from '@mui/x-charts/LineChart';
import { ChartContainer } from '@mui/x-charts/ChartContainer';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';

const weekDay = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const stepCurves = ['step', 'stepBefore', 'stepAfter'];

export default function ExpandingStep() {
  const [strictStepCurve, setStrictStepCurve] = React.useState(false);
  const [connectNulls, setConnectNulls] = React.useState(false);
  const [curve, setCurve] = React.useState('step');

  return (
    <Stack sx={{ width: '100%' }}>
      <Stack direction="row" justifyContent="space-between">
        <Stack>
          <FormControlLabel
            checked={connectNulls}
            control={
              <Checkbox
                onChange={(event) => setConnectNulls(event.target.checked)}
              />
            }
            label="connectNulls"
            labelPlacement="end"
          />
          <FormControlLabel
            checked={strictStepCurve}
            control={
              <Checkbox
                onChange={(event) => setStrictStepCurve(event.target.checked)}
              />
            }
            label="strictStepCurve"
            labelPlacement="end"
          />
        </Stack>
        <TextField
          select
          label="curve"
          value={curve}
          sx={{ minWidth: 100, mb: 2 }}
          onChange={(event) => setCurve(event.target.value)}
        >
          {stepCurves.map((curveType) => (
            <MenuItem key={curveType} value={curveType}>
              {curveType}
            </MenuItem>
          ))}
        </TextField>
      </Stack>

      <ChartContainer
        xAxis={[{ scaleType: 'band', data: weekDay }]}
        series={[
          {
            type: 'line',
            curve,
            connectNulls,
            strictStepCurve,
            data: [5, 10, 16, 9, null, 6],
            showMark: true,
            color: 'blue',
          },
          {
            type: 'line',
            curve,
            connectNulls,
            strictStepCurve,
            data: [null, 15, 9, 6, 8, 3, 10],
            showMark: true,
            color: 'red',
          },
          {
            data: [1, 2, 3, 4, 3, 2, 1],
            type: 'bar',
          },
        ]}
        height={200}
        margin={{ bottom: 10 }}
        skipAnimation
      >
        <ChartsAxisHighlight x="band" />
        <BarPlot />
        <LinePlot />
        <MarkPlot />
        <ChartsXAxis />
        <ChartsYAxis />
      </ChartContainer>
    </Stack>
  );
}
