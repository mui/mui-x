import * as React from 'react';
import { useDataset } from '@mui/x-charts/hooks';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { LineHighlightPlot, LinePlot } from '@mui/x-charts/LineChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

const dataset = [
  { month: 'Jan', revenue: 4000, expenses: 2400 },
  { month: 'Feb', revenue: 3000, expenses: 1398 },
  { month: 'Mar', revenue: 2000, expenses: 9800 },
  { month: 'Apr', revenue: 2780, expenses: 3908 },
  { month: 'May', revenue: 1890, expenses: 4800 },
  { month: 'Jun', revenue: 2390, expenses: 3800 },
  { month: 'Jul', revenue: 3490, expenses: 4300 },
];

function DatasetStats() {
  const chartDataset = useDataset();

  if (!chartDataset) {
    return null;
  }

  const totalRevenue = chartDataset.reduce(
    (sum, item) => sum + (typeof item.revenue === 'number' ? item.revenue : 0),
    0,
  );
  const totalExpenses = chartDataset.reduce(
    (sum, item) => sum + (typeof item.expenses === 'number' ? item.expenses : 0),
    0,
  );
  const profit = totalRevenue - totalExpenses;

  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        mb: 2,
        display: 'flex',
        gap: 3,
        justifyContent: 'space-around',
      }}
    >
      <div>
        <Typography variant="caption" color="text.secondary">
          Total Revenue
        </Typography>
        <Typography variant="h6" color="primary">
          ${totalRevenue.toLocaleString()}
        </Typography>
      </div>
      <div>
        <Typography variant="caption" color="text.secondary">
          Total Expenses
        </Typography>
        <Typography variant="h6" color="error">
          ${totalExpenses.toLocaleString()}
        </Typography>
      </div>
      <div>
        <Typography variant="caption" color="text.secondary">
          Net Profit
        </Typography>
        <Typography variant="h6" color={profit >= 0 ? 'success.main' : 'error.main'}>
          ${profit.toLocaleString()}
        </Typography>
      </div>
      <div>
        <Typography variant="caption" color="text.secondary">
          Data Points
        </Typography>
        <Typography variant="h6">{chartDataset.length}</Typography>
      </div>
    </Paper>
  );
}

export default function UseDataset() {
  return (
    <ChartDataProvider
      dataset={dataset}
      xAxis={[{ dataKey: 'month', scaleType: 'point' }]}
      series={[
        {
          dataKey: 'revenue',
          label: 'Revenue',
          color: '#1976d2',
          type: 'line',
        },
        {
          dataKey: 'expenses',
          label: 'Expenses',
          color: '#d32f2f',
          type: 'line',
        },
      ]}
      height={300}
    >
      <Box sx={{ width: '100%' }}>
        <DatasetStats />
        <ChartsSurface>
          <LinePlot />
          <ChartsXAxis />
          <ChartsYAxis />
          <ChartsAxisHighlight x="line" />
          <ChartsTooltip />
          <LineHighlightPlot />
        </ChartsSurface>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ChartsLegend direction="horizontal" />
        </Box>
      </Box>
    </ChartDataProvider>
  );
}
