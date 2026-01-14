import { type CartesianExtremumGetter, findMinMax } from '@mui/x-charts/internals';

export const getBaseExtremum: CartesianExtremumGetter<'heatmap'> = (params) => {
  const { axis } = params;

  return findMinMax(axis.data ?? []);
};
