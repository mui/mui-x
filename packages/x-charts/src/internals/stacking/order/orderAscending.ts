import { stackOrderNone, type Series } from '@mui/x-charts-vendor/d3-shape';
import { sum } from './sum';

export function orderAscending(series: Series<any, any>) {
  // @ts-expect-error doesn't seem like the Series.map is properly typed
  const sums = series.map(sum);
  return stackOrderNone(series).sort((a, b) => sums[a] - sums[b]);
}
