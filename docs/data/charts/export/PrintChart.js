import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';

import { BarChartPro } from '@mui/x-charts-pro/BarChartPro';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { data } from './randomData';
import { heatmapData } from './heatmapData';

const scatterSeries = [
  {
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
  },
  {
    label: 'Series B',
    data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
  },
];

const series = [
  { label: 'Series A', data: data.map((p) => p.y1) },
  { label: 'Series B', data: data.map((p) => p.y2) },
];

export default function PrintChart() {
  const [chartType, setChartType] = React.useState('scatter');
  const apiRef = React.useRef(undefined);

  const handleChange = (event) => setChartType(event.target.value);

  return (
    <Stack width="100%" sx={{ display: 'block' }}>
      <Stack
        width="100%"
        direction="row"
        gap={2}
        justifyContent="center"
        sx={{ mb: 1 }}
      >
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="chart-type-label">Chart Type</InputLabel>
          <Select
            labelId="chart-type-label"
            id="chart-type-select"
            value={chartType}
            label="Chart Type"
            onChange={handleChange}
          >
            <MenuItem value="scatter">Scatter</MenuItem>
            <MenuItem value="line">Line</MenuItem>
            <MenuItem value="bar">Bar</MenuItem>
            <MenuItem value="heatmap">Heatmap</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={() => apiRef.current.exportAsPrint} variant="contained">
          Print
        </Button>
      </Stack>
      <Chart apiRef={apiRef} type={chartType} />
    </Stack>
  );
}

function Chart({ apiRef, type }) {
  switch (type) {
    case 'scatter':
      return <ScatterChartPro apiRef={apiRef} height={300} series={scatterSeries} />;

    case 'line':
      return (
        <LineChartPro
          apiRef={apiRef}
          height={300}
          xAxis={[{ data: data.map((p) => p.x1).toSorted((a, b) => a - b) }]}
          series={series}
        />
      );

    case 'bar':
      return (
        <BarChartPro
          apiRef={apiRef}
          height={300}
          xAxis={[
            { data: data.map((p) => Math.round(p.x1)).toSorted((a, b) => a - b) },
          ]}
          series={series}
        />
      );

    case 'heatmap':
      return (
        <Heatmap
          apiRef={apiRef}
          xAxis={[{ data: [1, 2, 3, 4] }]}
          yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
          series={[{ data: heatmapData }]}
          height={300}
        />
      );

    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
}
