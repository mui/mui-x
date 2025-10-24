import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { data } from './randomData';

const highlightScope = { highlight: 'item', fade: 'global' } as const;

const scatterSeries = [
  {
    label: 'Series A',
    data: data.map((v) => ({ x: v.x1, y: v.y1, id: v.id })),
    highlightScope,
  },
  {
    label: 'Series B',
    data: data.map((v) => ({ x: v.x1, y: v.y2, id: v.id })),
    highlightScope,
  },
];
const series = [
  { label: 'Series A', data: data.map((p) => p.y1), highlightScope },
  { label: 'Series B', data: data.map((p) => p.y2), highlightScope },
];

type ChartType = 'scatter' | 'line' | 'bar' | 'pie';

export default function KeyboardNavigation() {
  const [chartType, setChartType] = React.useState<ChartType>('line');
  const svgRef = React.useRef<SVGSVGElement>(null);

  const handleChange = (event: SelectChangeEvent) =>
    setChartType(event.target.value as ChartType);

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
          </Select>
        </FormControl>
        <Button onClick={() => svgRef.current?.focus()} variant="contained">
          Focus chart
        </Button>
      </Stack>
      <Chart key={chartType} svgRef={svgRef} type={chartType} />
    </Stack>
  );
}

function Chart<T extends ChartType = ChartType>({
  svgRef,
  type,
}: {
  svgRef: React.RefObject<SVGSVGElement | null>;
  type: T;
}) {
  switch (type) {
    case 'scatter':
      return (
        <ScatterChart
          ref={svgRef}
          enableKeyboardNavigation
          height={300}
          series={scatterSeries}
        />
      );
    case 'line':
      return (
        <LineChart
          ref={svgRef}
          enableKeyboardNavigation
          height={300}
          xAxis={[{ data: data.map((p) => p.x1).toSorted((a, b) => a - b) }]}
          series={series}
          slotProps={{ tooltip: { trigger: 'item' } }}
        />
      );
    case 'bar':
      return (
        <BarChart
          ref={svgRef}
          enableKeyboardNavigation
          height={300}
          xAxis={[
            { data: data.map((p) => Math.round(p.x1)).toSorted((a, b) => a - b) },
          ]}
          slotProps={{ tooltip: { trigger: 'item' } }}
          series={series}
        />
      );
    case 'pie':
      return (
        <PieChart
          ref={svgRef}
          enableKeyboardNavigation
          series={[
            {
              arcLabel: 'value',
              data: [
                { id: 0, value: 10, label: 'series A' },
                { id: 1, value: 15, label: 'series B' },
                { id: 2, value: 20, label: 'series C' },
              ],
              highlightScope,
            },
          ]}
          height={300}
          hideLegend={false}
        />
      );

    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
}
