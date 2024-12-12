'use client';
import type { UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.selectors';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';

export function useXAxes() {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartXAxis);

  return { xAxis, xAxisIds };
}

export function useYAxes() {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartYAxis);

  return { yAxis, yAxisIds };
}

export function useXAxis(identifier?: number | string) {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: xAxis, axisIds: xAxisIds } = useSelector(store, selectorChartXAxis);

  const id = typeof identifier === 'string' ? identifier : xAxisIds[identifier ?? 0];

  return xAxis[id];
}

export function useYAxis(identifier?: number | string) {
  const store = useStore<[UseChartCartesianAxisSignature]>();
  const { axis: yAxis, axisIds: yAxisIds } = useSelector(store, selectorChartYAxis);

  const id = typeof identifier === 'string' ? identifier : yAxisIds[identifier ?? 0];

  return yAxis[id];
}
