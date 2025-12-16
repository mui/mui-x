import type { Series } from '@mui/x-charts-vendor/d3-shape';

export function none(series: any[]) {
  const indices = new Array(series.length);
  for (let i = 0; i < series.length; i += 1) {
    indices[i] = i;
  }
  return indices;
}

export function orderAppearance(series: any[]) {
  const peaks = series.map(getPeakIndex);
  return none(series).sort((a, b) => peaks[a] - peaks[b]);
}

function getPeakIndex(series: Series<any, any>): number {
  let maxValue = -Infinity;
  let maxIndex = 0;

  for (let i = 0; i < series.length; i += 1) {
    // Main difference with d3's implementation: we consider the original data value if present
    // in order to make data with value 0 appear in the correct position
    const value = series[i].data[series.key] ?? +series[i][1];
    if (value > maxValue) {
      maxValue = value;
      maxIndex = i;
    }
  }

  return maxIndex;
}

export function orderAscending(series: any[]) {
  const sums = series.map(sum);
  return none(series).sort((a, b) => sums[a] - sums[b]);
}

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

export function orderDescending(series: any[]) {
  return orderAscending(series).reverse();
}

export function orderInsideOut(series: any[]) {
  const n = series.length;
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
