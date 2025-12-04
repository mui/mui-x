import { createSelector } from '@mui/x-internals/store';
import { ChartRootSelector } from '../../utils/selectors';
import { UseChartClosestPointSignature } from './useChartClosestPoint.types';

const selectVoronoi: ChartRootSelector<UseChartClosestPointSignature> = (state) => state.voronoi;

export const selectorChartsIsVoronoiEnabled = createSelector(
  selectVoronoi,
  (voronoi) => voronoi?.isVoronoiEnabled,
);
