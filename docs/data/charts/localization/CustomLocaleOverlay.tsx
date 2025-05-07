import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

export default function CustomLocaleOverlay() {
  return (
    <BarChart
      loading
      localeText={{ loading: 'Data are coming 🧙‍♂️' }}
      series={[]}
      height={200}
      width={300}
      xAxis={[{ data: ['Q1', 'Q2', 'Q3', 'Q4'] }]}
    />
  );
}
