'use client';
import type { UseChartCartesianAxisSignature } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import {
  selectorChartXAxis,
  selectorChartYAxis,
} from '../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxis.selectors';
import {
  selectorChartRadiusAxis,
  selectorChartRotationAxis,
  UseChartPolarAxisSignature,
} from '../internals/plugins/featurePlugins/useChartPolarAxis';
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

export function useRotationAxes() {
  const store = useStore<[UseChartPolarAxisSignature]>();
  const { axis: rotationAxis, axisIds: rotationAxisIds } = useSelector(
    store,
    selectorChartRotationAxis,
  );

  return { rotationAxis, rotationAxisIds };
}

export function useRadiusAxes() {
  const store = useStore<[UseChartPolarAxisSignature]>();
  const { axis: radiusAxis, axisIds: radiusAxisIds } = useSelector(store, selectorChartRadiusAxis);

  return { radiusAxis, radiusAxisIds };
}

export function useRotationAxis(identifier?: number | string) {
  const store = useStore<[UseChartPolarAxisSignature]>();
  const { axis: rotationAxis, axisIds: rotationAxisIds } = useSelector(
    store,
    selectorChartRotationAxis,
  );

  const id = typeof identifier === 'string' ? identifier : rotationAxisIds[identifier ?? 0];

  return rotationAxis[id];
}

export function useRadiusAxis(identifier?: number | string) {
  const store = useStore<[UseChartPolarAxisSignature]>();
  const { axis: radiusAxis, axisIds: radiusAxisIds } = useSelector(store, selectorChartRadiusAxis);

  const id = typeof identifier === 'string' ? identifier : radiusAxisIds[identifier ?? 0];

  return radiusAxis[id];
}
