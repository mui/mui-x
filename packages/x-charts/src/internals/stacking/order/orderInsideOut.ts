import type { Series } from '@mui/x-charts-vendor/d3-shape';
import { sum } from './sum';
import { orderAppearance } from './orderAppearance';

export function orderInsideOut(series: Series<any, any>) {
  const n = series.length;
  // @ts-expect-error doesn't seem like the Series.map is properly typed
  const sums = series.map(sum);
  const order = orderAppearance(series);
  const tops: number[] = [];
  const bottoms: number[] = [];
  let top = 0;
  let bottom = 0;

  for (let i = 0; i < n; i += 1) {
    const seriesIndex = order[i];
    const seriesSum = sums[seriesIndex];

    if (top < bottom) {
      top += seriesSum;
      tops.push(seriesIndex);
    } else {
      bottom += seriesSum;
      bottoms.push(seriesIndex);
    }
  }

  return bottoms.reverse().concat(tops);
}
