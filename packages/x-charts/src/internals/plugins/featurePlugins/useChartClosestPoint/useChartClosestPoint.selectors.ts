import { createSelector } from '@mui/x-internals/store';
import { type ChartRootSelector } from '../../utils/selectors';
import { type UseChartClosestPointSignature } from './useChartClosestPoint.types';

const selectVoronoi: ChartRootSelector<UseChartClosestPointSignature> = (state) => state.voronoi;

export const selectorChartsIsVoronoiEnabled = createSelector(
  selectVoronoi,
  (voronoi) => voronoi?.isVoronoiEnabled,
);
