import type { Series } from '@mui/x-charts-vendor/d3-shape';
import { orderAscending } from './orderAscending';

export function orderDescending(series: Series<any, any>) {
  return orderAscending(series).reverse();
}
