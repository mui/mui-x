import { type ChartPluginSignature } from '../../models';
import { type ChartSeriesType } from '../../../../models/seriesType/config';
import { type SeriesId } from '../../../../models/seriesType/common';
import { type UseChartInteractionSignature } from '../useChartInteraction';
import { type UseChartHighlightSignature } from '../useChartHighlight';

export interface UseChartKeyboardNavigationInstance {}

type SeriesItemIdentifier<SeriesType extends ChartSeriesType = FocusableSeriesTypes> =
  SeriesType extends FocusableSeriesTypes
    ? {
        /**
         * The type of the series
         */
        type: SeriesType;
        /**
         * The id of the series with focus.
         */
        seriesId: SeriesId;
        /**
         * The index of the data point with focus.
         */
        dataIndex: number;
      }
    : never;

export type FocusableSeriesTypes = 'bar' | 'line' | 'scatter' | 'pie';

export interface UseChartKeyboardNavigationState {
  keyboardNavigation: {
    item: null | SeriesItemIdentifier;
    enableKeyboardNavigation: boolean;
  };
}

type UseChartKeyboardNavigationParameters = {
  enableKeyboardNavigation?: boolean;
};

export type UseChartKeyboardNavigationSignature = ChartPluginSignature<{
  params: UseChartKeyboardNavigationParameters;
  defaultizedParams: UseChartKeyboardNavigationParameters;
  instance: UseChartKeyboardNavigationInstance;
  state: UseChartKeyboardNavigationState;
  optionalDependencies: [UseChartInteractionSignature, UseChartHighlightSignature];
}>;
