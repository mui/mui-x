import type { ChartPluginSignature } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { SeriesItemIdentifierWithType } from '../../../../models/seriesType';
import type { ChartSeriesTypeRequiredPlugins } from '../../corePlugins/useChartSeriesConfig';
import type { UseChartKeyboardNavigationSignature } from '../useChartKeyboardNavigation';
import type { ChartsActivationEvent } from '../../../../models/events';

export interface UseChartItemClickParameters<SeriesType extends ChartSeriesType = ChartSeriesType> {
  /**
   * The callback fired when an item is clicked.
   *
   * @param {ChartsActivationEvent<HTMLDivElement>} event The click event.
   * @param {SeriesItemIdentifierWithType<SeriesType>} item The clicked item.
   */
  onItemClick?: (
    event: ChartsActivationEvent<HTMLDivElement>,
    item: SeriesItemIdentifierWithType<SeriesType>,
  ) => void;
}

export interface UseChartItemClickInstance {
  handleClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export interface UseChartItemClickState {}

export type UseChartItemClickSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartItemClickParameters<SeriesType>;
    defaultizedParams: UseChartItemClickParameters<SeriesType>;
    instance: UseChartItemClickInstance;
    dependencies: ChartSeriesTypeRequiredPlugins<SeriesType>;
    optionalDependencies: [UseChartKeyboardNavigationSignature];
  }>;
