import type {
  CartesianChartSeriesType,
  ChartSeriesType,
} from '../../../../models/seriesType/config';
import type { FocusedItemIdentifier, FocusedItemValues } from '../../../../models/seriesType';
import type { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import type { ChartState } from '../../models/chart';
import type { UseChartCartesianAxisSignature } from '../useChartCartesianAxis';

export type FocusedValuesGetter<TSeriesType extends ChartSeriesType> = (
  currentItem: FocusedItemIdentifier<TSeriesType>,
  state: TSeriesType extends CartesianChartSeriesType
    ? Pick<
        ChartState<
          [UseChartKeyboardNavigationSignature],
          [UseChartCartesianAxisSignature],
          TSeriesType
        >,
        'series' | 'cartesianAxis'
      >
    : Pick<ChartState<[UseChartKeyboardNavigationSignature], [], TSeriesType>, 'series'>,
) => FocusedItemValues<TSeriesType>;
