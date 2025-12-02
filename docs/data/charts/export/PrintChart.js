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
import { FunnelChart } from '@mui/x-charts-pro/FunnelChart';
import { useChartProApiRef } from '@mui/x-charts-pro/hooks';
import { RadarChartPro } from '@mui/x-charts-pro/RadarChartPro';
import { PieChartPro } from '@mui/x-charts-pro/PieChartPro';
import { Unstable_SankeyChart } from '@mui/x-charts-pro/SankeyChart';
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

const sankeySeries = {
  data: {
    links: [
      { source: 'A', target: 'B', value: 10 },
      { source: 'A', target: 'C', value: 5 },
      { source: 'B', target: 'D', value: 8 },
      { source: 'C', target: 'D', value: 3 },
    ],
  },
};
const series = [
  { label: 'Series A', data: data.map((p) => p.y1) },
  { label: 'Series B', data: data.map((p) => p.y2) },
];

export default function PrintChart() {
  const [chartType, setChartType] = React.useState('scatter');
  const apiRef = useChartProApiRef();

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
            <MenuItem value="pie">Pie</MenuItem>
            <MenuItem value="heatmap">Heatmap</MenuItem>
            <MenuItem value="funnel">Funnel</MenuItem>
            <MenuItem value="radar">Radar</MenuItem>
            <MenuItem value="sankey">Sankey</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={() => apiRef.current.exportAsPrint()} variant="contained">
          Print
        </Button>
      </Stack>
      <Chart key={chartType} apiRef={apiRef} type={chartType} />
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

    case 'pie':
      return (
        <PieChartPro
          apiRef={apiRef}
          series={[
            {
              arcLabel: 'value',
              data: [
                { id: 0, value: 10, label: 'series A' },
                { id: 1, value: 15, label: 'series B' },
                { id: 2, value: 20, label: 'series C' },
              ],
            },
          ]}
          height={300}
          hideLegend={false}
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
          hideLegend={false}
        />
      );

    case 'funnel':
      return (
        <FunnelChart
          apiRef={apiRef}
          width={400}
          height={300}
          series={[
            {
              data: [
                { label: 'Visitors', value: 200 },
                { label: 'Product Page Views', value: 180 },
                { label: 'Added to Cart', value: 90 },
                { label: 'Purchased', value: 50 },
              ],
            },
          ]}
        />
      );

    case 'radar':
      return (
        <RadarChartPro
          apiRef={apiRef}
          height={300}
          series={[{ label: 'Lisa', data: [120, 98, 86, 99, 85, 65] }]}
          radar={{
            max: 120,
            metrics: [
              'Math',
              'Chinese',
              'English',
              'Geography',
              'Physics',
              'History',
            ],
          }}
        />
      );

    case 'sankey':
      return (
        <Unstable_SankeyChart apiRef={apiRef} height={300} series={sankeySeries} />
      );

    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
}
