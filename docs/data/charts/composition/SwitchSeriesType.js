import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { ChartsContainer } from '@mui/x-charts/ChartsContainer';
import { BarPlot } from '@mui/x-charts/BarChart';
import { LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';

export default function SwitchSeriesType() {
  const [type, setType] = React.useState('line');

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        select
        value={type}
        onChange={(event) => setType(event.target.value)}
        label="series type"
        sx={{ minWidth: 150 }}
      >
        <MenuItem value="line">line</MenuItem>
        <MenuItem value="bar">bar</MenuItem>
      </TextField>
      <div>
        <ChartsContainer
          series={[
            {
              type,
              data: [1, 2, 3, 2, 1],
            },
            {
              type,
              data: [4, 3, 1, 3, 4],
            },
          ]}
          xAxis={[
            {
              data: ['A', 'B', 'C', 'D', 'E'],
              scaleType: 'band',
              id: 'x-axis-id',
              height: 48,
            },
          ]}
          height={200}
        >
          <BarPlot />
          <LinePlot />
          <ChartsXAxis label="X axis" axisId="x-axis-id" />
        </ChartsContainer>
      </div>
    </Box>
  );
}
