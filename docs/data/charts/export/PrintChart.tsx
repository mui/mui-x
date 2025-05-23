import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { ScatterChartPro } from '@mui/x-charts-pro/ScatterChartPro';
import { ChartProApi } from '@mui/x-charts-pro/ChartContainerPro';
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

type ChartType = 'scatter' | 'line' | 'bar' | 'heatmap';

export default function PrintChart() {
  const [chartType, setChartType] = React.useState<ChartType>('scatter');
  const apiRef = React.useRef<ChartProApi>(undefined);

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
            <MenuItem value="heatmap">Heatmap</MenuItem>
          </Select>
        </FormControl>
        <Button onClick={() => apiRef.current!.exportAsPrint()} variant="contained">
          Print
        </Button>
      </Stack>
      <Chart apiRef={apiRef} type={chartType} />
    </Stack>
  );
}

function Chart<T extends ChartType = ChartType>({
  apiRef,
  type,
}: {
  apiRef: React.RefObject<ChartProApi<T> | undefined>;
  type: T;
}) {
  switch (type) {
    case 'scatter':
      return (
        <ScatterChartPro
          apiRef={apiRef as React.RefObject<ChartProApi<'scatter'> | undefined>}
          height={300}
          series={scatterSeries}
        />
      );
    case 'line':
      return (
        <LineChartPro
          apiRef={apiRef as React.RefObject<ChartProApi<'line'> | undefined>}
          height={300}
          xAxis={[{ data: data.map((p) => p.x1).toSorted((a, b) => a - b) }]}
          series={series}
        />
      );
    case 'bar':
      return (
        <BarChartPro
          apiRef={apiRef as React.RefObject<ChartProApi<'bar'> | undefined>}
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
          apiRef={apiRef as React.RefObject<ChartProApi<'heatmap'> | undefined>}
          xAxis={[{ data: [1, 2, 3, 4] }]}
          yAxis={[{ data: ['A', 'B', 'C', 'D', 'E'] }]}
          series={[{ data: heatmapData }]}
          height={300}
          hideLegend={false}
        />
      );
    default:
      throw new Error(`Unknown chart type: ${type}`);
  }
}
