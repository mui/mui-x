// @ts-nocheck
import * as React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { BarChart } from '@mui/x-charts/BarChart';
import { ChartsDataProvider } from '@mui/x-charts/ChartsDataProvider';
import { LineChartPro } from '@mui/x-charts-pro/LineChartPro';

// prettier-ignore
function App() {
  return (
    <React.Fragment>
      <LineChart series={[]} />
      <BarChart series={[]} />
      <ChartsDataProvider series={[]} />
      <LineChartPro series={[]} />
      <LineChart {...props} />
    </React.Fragment>
  );
}

export default App;
