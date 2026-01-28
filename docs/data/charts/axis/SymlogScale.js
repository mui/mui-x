import * as React from 'react';
import Stack from '@mui/material/Stack';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';

export default function SymlogScale() {
  const [chartType, setChartType] = React.useState('bar');

  const handleChartType = (event, newChartType) => {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  };

  return (
    <Stack width="100%" gap={2}>
      <ToggleButtonGroup
        value={chartType}
        exclusive
        onChange={handleChartType}
        aria-label="chart type"
        fullWidth
      >
        {['bar', 'area'].map((type) => (
          <ToggleButton key={type} value={type}>
            {type}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
      {chartType === 'bar' && <SymlogBarChart />}
      {chartType === 'area' && <SymlogAreaChart />}
    </Stack>
  );
}

function SymlogBarChart() {
  return (
    <BarChart
      xAxis={[{ data: ['group A', 'group B', 'group C'] }]}
      yAxis={[{ scaleType: 'symlog', constant: 1, width: 52 }]}
      series={[
        { data: [4_000, 30, 50] },
        { data: [1, 600, 34] },
        { data: [20, 5, 60_000] },
      ]}
      height={500}
    />
  );
}

function SymlogAreaChart() {
  return (
    <LineChart
      xAxis={[{ data: [1, 2, 3, 5, 8, 10, 12, 15] }]}
      yAxis={[{ scaleType: 'symlog', width: 56 }]}
      series={[
        {
          data: [10, 1_000, 5_000, 10_000, -50_000, 20_000, 100_000, -500],
          area: true,
        },
      ]}
      height={500}
    />
  );
}
