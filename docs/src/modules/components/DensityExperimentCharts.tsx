// Review surface for the charts density enhancer, routed from
// `docs/pages/x/density-experiment-charts.js`. Remove or turn into a docs demo before merge.
import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { ChartsAxisHighlightValue } from '@mui/x-charts/ChartsAxisHighlightValue';
import { PiecewiseColorLegend, ContinuousColorLegend } from '@mui/x-charts/ChartsLegend';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';
import { Heatmap } from '@mui/x-charts-pro/Heatmap';
import { unstable_enhanceDensity as enhanceCharts } from '@mui/x-charts-premium/density';
import DensityExperimentShell, { createEnhancedTheme } from './DensityExperimentShell';

const enhanced = createEnhancedTheme(enhanceCharts);

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
const series = [
  { id: 'grid', label: 'Grid', data: [4, 6, 5, 8, 7, 9] },
  { id: 'pickers', label: 'Pickers', data: [2, 3, 6, 4, 5, 6] },
  { id: 'charts', label: 'Charts', data: [1, 4, 3, 5, 6, 4], showMark: true },
];
const heatmapData = [0, 1, 2, 3].flatMap((x) =>
  [0, 1, 2].map((y) => [x, y, (x * 3 + y) % 7] as [number, number, number]),
);

function Demo({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box sx={{ width: 420 }}>
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default function DensityExperimentCharts() {
  return (
    <DensityExperimentShell
      title="Charts density — material enhancer + charts enhancer chain"
      description={
        <React.Fragment>
          Right column: <code>enhanceCharts(enhanceMaterial(createTheme(...)))</code> with the
          Premium enhancer (Pro and community underneath). Only the HTML parts change: legends,
          tooltips, the toolbar and axis value labels. Hover a bar or a heatmap cell to review the
          tooltips.
        </React.Fragment>
      }
      enhanced={enhanced}
      componentNames={[
        'MuiChartsLegend',
        'MuiContinuousColorLegend',
        'MuiPiecewiseColorLegend',
        'MuiChartsLabelMark',
        'MuiChartsTooltip',
        'MuiChartsToolbar',
        'MuiChartsAxisHighlightValue',
        'MuiChartsHeatmapTooltip',
      ]}
    >
      {() => (
        <Stack
          direction="row"
          spacing={2}
          useFlexGap
          sx={{ flexWrap: 'wrap', alignItems: 'flex-start' }}
        >
          <Demo title="Series legend">
            <LineChart
              height={260}
              xAxis={[{ scaleType: 'point', data: months }]}
              series={series}
            />
          </Demo>
          <Demo title="Axis tooltip (hover)">
            <BarChart
              height={260}
              xAxis={[{ scaleType: 'band', data: months }]}
              series={series.slice(0, 2).map(({ id, label, data }) => ({ id, label, data }))}
              slotProps={{ tooltip: { trigger: 'axis' } }}
            />
          </Demo>
          <Demo title="Piecewise color legend">
            <LineChart
              height={220}
              xAxis={[
                {
                  scaleType: 'point',
                  data: months,
                  colorMap: {
                    type: 'piecewise',
                    thresholds: [2, 4],
                    colors: ['#1976d2', '#ed6c02', '#2e7d32'],
                  },
                },
              ]}
              series={[{ data: [1, 3, 5, 2, 6, 4] }]}
              slots={{ legend: PiecewiseColorLegend }}
              slotProps={{
                legend: {
                  axisDirection: 'x',
                  direction: 'horizontal',
                  labelPosition: 'inline-end',
                },
              }}
            />
          </Demo>
          <Demo title="Continuous color legend">
            <LineChart
              height={220}
              xAxis={[{ scaleType: 'point', data: months }]}
              yAxis={[
                { colorMap: { type: 'continuous', min: 0, max: 8, color: ['#90caf9', '#d32f2f'] } },
              ]}
              series={[{ data: [1, 3, 5, 2, 6, 8] }]}
              slots={{ legend: ContinuousColorLegend }}
              slotProps={{ legend: { axisDirection: 'y', direction: 'horizontal' } }}
            />
          </Demo>
          <Demo title="Axis value labels">
            <ScatterChart
              height={220}
              series={[
                {
                  data: [
                    { x: 1, y: 2, id: 1 },
                    { x: 3, y: 5, id: 2 },
                    { x: 5, y: 3, id: 3 },
                  ],
                },
              ]}
              slotProps={{ tooltip: { trigger: 'none' } }}
              hideLegend
            >
              <ChartsAxisHighlightValue axisDirection="y" labelPosition="end" value={4} />
              <ChartsAxisHighlightValue axisDirection="x" labelPosition="end" value={2} />
            </ScatterChart>
          </Demo>
          <Demo title="Toolbar (Pro)">
            <LineChartPro
              height={240}
              xAxis={[{ scaleType: 'point', data: months, zoom: true }]}
              series={series.slice(0, 2)}
              showToolbar
            />
          </Demo>
          <Demo title="Heatmap tooltip (Pro, hover)">
            <Heatmap
              height={240}
              xAxis={[{ data: ['A', 'B', 'C', 'D'] }]}
              yAxis={[{ data: ['X', 'Y', 'Z'] }]}
              series={[{ data: heatmapData, label: 'Load' }]}
            />
          </Demo>
        </Stack>
      )}
    </DensityExperimentShell>
  );
}
