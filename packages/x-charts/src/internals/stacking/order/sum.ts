import type { Series } from '@mui/x-charts-vendor/d3-shape';

export function sum(series: Series<any, any>): number {
  let total = 0;

  for (let i = 0; i < series.length; i += 1) {
    // Main difference with d3's implementation: we consider the original data value if present
    // in order to make data with value 0 appear in the correct position
    const value = series[i].data[series.key] ?? +series[i][1];
    if (value) {
      total += value;
    }
  }

  return total;
}
