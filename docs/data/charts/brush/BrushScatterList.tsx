import * as React from 'react';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { ScatterPlot } from '@mui/x-charts/ScatterChart';
import { ChartsAxis } from '@mui/x-charts/ChartsAxis';
import {
  useBrush,
  useScatterSeries,
  useXScale,
  useYScale,
} from '@mui/x-charts/hooks';
import { ChartsBrushOverlay } from '@mui/x-charts/ChartsBrushOverlay';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

const scatterData = [
  { x: 5, y: 12, id: 1 },
  { x: 12, y: 18, id: 2 },
  { x: 18, y: 9, id: 3 },
  { x: 25, y: 22, id: 4 },
  { x: 32, y: 15, id: 5 },
  { x: 40, y: 28, id: 6 },
  { x: 48, y: 20, id: 7 },
  { x: 55, y: 35, id: 8 },
  { x: 62, y: 25, id: 9 },
  { x: 70, y: 40, id: 10 },
  { x: 78, y: 32, id: 11 },
  { x: 85, y: 45, id: 12 },
  { x: 15, y: 30, id: 13 },
  { x: 35, y: 38, id: 14 },
  { x: 50, y: 42, id: 15 },
  { x: 65, y: 36, id: 16 },
  { x: 22, y: 25, id: 17 },
  { x: 44, y: 33, id: 18 },
  { x: 58, y: 29, id: 19 },
  { x: 72, y: 37, id: 20 },
];

const empty: { x: number; y: number; id: number }[] = [];

function ChartContent() {
  return (
    <React.Fragment>
      <ScatterPlot />
      <ChartsAxis />
      <ChartsBrushOverlay />
    </React.Fragment>
  );
}

function SelectedPointsList() {
  const brush = useBrush();
  const series = useScatterSeries('data');
  const xScale = useXScale<'linear'>();
  const yScale = useYScale<'linear'>();

  const selectedData = React.useMemo(() => {
    if (!brush || !series || !xScale || !yScale) {
      return empty;
    }

    const { start, current } = brush;

    // Get the min/max x and y positions
    const minX = Math.min(start.x!, current.x!);
    const maxX = Math.max(start.x!, current.x!);
    const minY = Math.min(start.y!, current.y!);
    const maxY = Math.max(start.y!, current.y!);

    // Convert pixel coordinates back to data values
    const minDataX = xScale.invert(minX);
    const maxDataX = xScale.invert(maxX);
    const minDataY = yScale.invert(maxY);
    const maxDataY = yScale.invert(minY);

    // Filter data points within the brush selection
    const d = series.data
      .map((point, index) => ({
        x: point.x as number,
        y: point.y as number,
        id: (point.id as number) ?? index + 1,
      }))
      .filter((point) => {
        return (
          point.x >= (minDataX as number) &&
          point.x <= (maxDataX as number) &&
          point.y >= (minDataY as number) &&
          point.y <= (maxDataY as number)
        );
      });

    return d;
  }, [brush, series, xScale, yScale]);

  if (selectedData.length === 0) {
    return (
      <Box sx={{ mt: 3 }}>
        <Typography variant="body2" color="text.secondary">
          No points selected. Drag on the chart to select data points.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle2" gutterBottom>
        Selected Points ({selectedData.length}):
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
        {selectedData.map((point) => (
          <Chip
            key={point.id}
            label={`#${point.id}: (${point.x}, ${point.y})`}
            color="primary"
            variant="outlined"
            size="small"
          />
        ))}
      </Stack>
    </Box>
  );
}

export default function BrushScatterList() {
  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" sx={{ mb: 2 }}>
        Drag to select points on the scatter chart. Selected points will be displayed
        below.
      </Typography>
      <ChartDataProvider
        series={[
          {
            type: 'scatter',
            data: scatterData,
            id: 'data',
            label: 'Data Points',
          },
        ]}
        xAxis={[{ id: 'x-axis', min: 0, max: 100 }]}
        yAxis={[{ id: 'y-axis', min: 0, max: 50 }]}
        height={400}
        brushConfig={{ enabled: true }}
      >
        <ChartsSurface>
          <ChartContent />
        </ChartsSurface>
        <SelectedPointsList />
      </ChartDataProvider>
    </Box>
  );
}
