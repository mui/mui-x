import { UseChartCartesianAxisSignature } from './useChartCartesianAxis.types';
import { DefaultedXAxis, DefaultedYAxis } from '../../../../models/axis';
import { ChartState } from '../../models/chart';

export const selectorChartCartesianAxisState = (
  state: ChartState<[], [UseChartCartesianAxisSignature]>,
) => state.cartesianAxis;

export type SelectorChartRawXAxisType = <State extends ChartState<[], [UseChartCartesianAxisSignature]>>(
  state: State,
) => DefaultedXAxis[] | undefined;

export const selectorChartRawXAxis: SelectorChartRawXAxisType = (state) => state.cartesianAxis?.x;

export type SelectorChartRawYAxisType = <State extends ChartState<[], [UseChartCartesianAxisSignature]>>(
  state: State,
) => DefaultedYAxis[] | undefined;

export const selectorChartRawYAxis: SelectorChartRawYAxisType = (state) => state.cartesianAxis?.y;
