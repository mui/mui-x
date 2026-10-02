import { findMinMax } from '@mui/x-charts/internals';
import type { CartesianExtremumGetter } from '@mui/x-charts/internals';

export const getBaseExtremum: CartesianExtremumGetter<'heatmap'> = (params) => {
  const { axis } = params;

  return findMinMax(axis.data ?? []);
};
