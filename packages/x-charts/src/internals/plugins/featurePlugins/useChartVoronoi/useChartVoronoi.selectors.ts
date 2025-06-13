import { ChartRootSelector, createSelector } from '../../utils/selectors';
import { UseChartVoronoiSignature } from './useChartVoronoi.types';

const selectVoronoi: ChartRootSelector<UseChartVoronoiSignature> = (state) => state.voronoi;

export const selectorChartsVoronoiIsVoronoiEnabled = createSelector(
  selectVoronoi,
  (voronoi) => voronoi?.isVoronoiEnabled,
);
