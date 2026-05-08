import { type UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { type DefaultedXAxis, type DefaultedYAxis } from '../../../../models/axis';
import { type ChartState } from '../../models/chart';

export const selectorChartCartesianAxisState = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.cartesianAxis;

export type SelectorChartRawXAxisType = <
  State extends ChartState<[], [UseChartCartesianAxisSignature]>,
>(
  state: State,
) => DefaultedXAxis[] | undefined;

export const selectorChartRawXAxis: SelectorChartRawXAxisType = (state) => state.cartesianAxis?.x;

export type SelectorChartRawYAxisType = <
  State extends ChartState<[], [UseChartCartesianAxisSignature]>,
>(
  state: State,
) => DefaultedYAxis[] | undefined;

export const selectorChartRawYAxis: SelectorChartRawYAxisType = (state) => state.cartesianAxis?.y;

export const selectorChartCartesianAxesGap = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.cartesianAxis?.axesGap ?? 0;

/**
 * Lifecycle status of the async cartesian-axis processing pipeline.
 */
export const selectorChartCartesianAxisStatus = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.cartesianAxis?.status ?? 'success';

/**
 * Last error captured by the cartesian-axis processing pipeline (if any).
 */
export const selectorChartCartesianAxisError = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.cartesianAxis?.error;
