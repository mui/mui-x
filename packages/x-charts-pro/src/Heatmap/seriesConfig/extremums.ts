import { CartesianExtremumGetter } from '@mui/x-charts/internals';

export const getBaseExtremum: CartesianExtremumGetter<'heatmap'> = (params) => {
  const { axis } = params;

  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};
