import { ChartRootSelector, createChartSelector } from '../../utils/selectors';
import { UseChartClosestPointSignature } from './useChartClosestPoint.types';

const selectVoronoi: ChartRootSelector<UseChartClosestPointSignature> = (state) => state.voronoi;

export const selectorChartsIsVoronoiEnabled = createChartSelector(
  [selectVoronoi],
  (voronoi) => voronoi?.isVoronoiEnabled,
);
