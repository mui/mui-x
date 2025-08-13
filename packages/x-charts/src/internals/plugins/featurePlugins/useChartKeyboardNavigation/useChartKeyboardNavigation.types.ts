import { ChartPluginSignature } from '../../models';
import { ChartSeriesType } from '../../../../models/seriesType/config';
import { SeriesId } from '../../../../models/seriesType/common';

export interface UseChartKeyboardNavigationInstance {}

type SeriesItemIdentifier = {
  /**
   * The type of the series
   */
  type: ChartSeriesType;
  /**
   * The series id of the funnel.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point in the series.
   */
  dataIndex: number;
};

export interface UseChartKeyboardNavigationState {
  keyboardNavigation: null | SeriesItemIdentifier;
}

export type UseChartKeyboardNavigationSignature = ChartPluginSignature<{
  instance: UseChartKeyboardNavigationInstance;
  state: UseChartKeyboardNavigationState;
}>;
