import * as React from 'react';
import { useDataset } from '@mui/x-charts/hooks';
import { ChartDataProvider } from '@mui/x-charts/ChartDataProvider';
import { ChartsSurface } from '@mui/x-charts/ChartsSurface';
import { BarPlot } from '@mui/x-charts/BarChart';
import { ChartsXAxis } from '@mui/x-charts/ChartsXAxis';
import { ChartsYAxis } from '@mui/x-charts/ChartsYAxis';
import { ChartsLegend } from '@mui/x-charts/ChartsLegend';
import { ChartsTooltip } from '@mui/x-charts/ChartsTooltip';
import { ChartsAxisHighlight } from '@mui/x-charts/ChartsAxisHighlight';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const dataset = [
  { product: 'Product A', q1: 4000, q2: 3000, q3: 2000, q4: 2780 },
  { product: 'Product B', q1: 3000, q2: 1398, q3: 9800, q4: 3908 },
  { product: 'Product C', q1: 2000, q2: 9800, q3: 3000, q4: 4800 },
  { product: 'Product D', q1: 2780, q2: 3908, q3: 4000, q4: 3800 },
  { product: 'Product E', q1: 1890, q2: 4800, q3: 2390, q4: 3800 },
];

function DataTable() {
  const chartDataset = useDataset();

  if (!chartDataset) {
    return null;
  }

  const calculateTotal = (item) => {
    return ['q1', 'q2', 'q3', 'q4'].reduce((sum, quarter) => {
      return sum + (item[quarter] || 0);
    }, 0);
  };

  const calculateQuarterTotal = (quarter) => {
    return chartDataset.reduce((sum, item) => {
      return sum + (item[quarter] || 0);
    }, 0);
  };

  const grandTotal = chartDataset.reduce(
    (sum, item) => sum + calculateTotal(item),
    0,
  );

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>
              <strong>Product</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Q1</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Q2</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Q3</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Q4</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Total</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {chartDataset.map((row) => (
            <TableRow key={row.product}>
              <TableCell component="th" scope="row">
                {row.product}
              </TableCell>
              <TableCell align="right">${(row.q1 || 0).toLocaleString()}</TableCell>
              <TableCell align="right">${(row.q2 || 0).toLocaleString()}</TableCell>
              <TableCell align="right">${(row.q3 || 0).toLocaleString()}</TableCell>
              <TableCell align="right">${(row.q4 || 0).toLocaleString()}</TableCell>
              <TableCell align="right">
                <strong>${calculateTotal(row).toLocaleString()}</strong>
              </TableCell>
            </TableRow>
          ))}
          <TableRow sx={{ backgroundColor: 'action.hover' }}>
            <TableCell>
              <strong>Total</strong>
            </TableCell>
            <TableCell align="right">
              <strong>${calculateQuarterTotal('q1').toLocaleString()}</strong>
            </TableCell>
            <TableCell align="right">
              <strong>${calculateQuarterTotal('q2').toLocaleString()}</strong>
            </TableCell>
            <TableCell align="right">
              <strong>${calculateQuarterTotal('q3').toLocaleString()}</strong>
            </TableCell>
            <TableCell align="right">
              <strong>${calculateQuarterTotal('q4').toLocaleString()}</strong>
            </TableCell>
            <TableCell align="right">
              <strong>${grandTotal.toLocaleString()}</strong>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default function UseDatasetAdvanced() {
  return (
    <ChartDataProvider
      dataset={dataset}
      xAxis={[{ dataKey: 'product', scaleType: 'band' }]}
      series={[
        { dataKey: 'q1', label: 'Q1', stack: 'total', type: 'bar' },
        { dataKey: 'q2', label: 'Q2', stack: 'total', type: 'bar' },
        { dataKey: 'q3', label: 'Q3', stack: 'total', type: 'bar' },
        { dataKey: 'q4', label: 'Q4', stack: 'total', type: 'bar' },
      ]}
      height={300}
    >
      <Box sx={{ width: '100%' }}>
        <Typography variant="h6" gutterBottom>
          Quarterly Sales Report
        </Typography>
        <ChartsSurface>
          <BarPlot />
          <ChartsXAxis />
          <ChartsYAxis />
          <ChartsAxisHighlight x="band" />
          <ChartsTooltip />
        </ChartsSurface>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <ChartsLegend direction="horizontal" />
        </Box>
        <DataTable />
      </Box>
    </ChartDataProvider>
  );
}
