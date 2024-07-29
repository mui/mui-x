import { ExtremumGetter } from '@mui/x-charts/internals';

export const getBaseExtremum: ExtremumGetter<'heatmap'> = (params) => {
  const { axis } = params;

  const minX = Math.min(...(axis.data ?? []));
  const maxX = Math.max(...(axis.data ?? []));
  return [minX, maxX];
};
