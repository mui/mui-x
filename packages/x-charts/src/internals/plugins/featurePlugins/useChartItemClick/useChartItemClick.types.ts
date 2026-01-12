import type { ChartPluginSignature } from '../../models';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { SeriesItemIdentifier } from '../../../../models/seriesType';

export interface UseChartItemClickParameters<SeriesType extends ChartSeriesType = ChartSeriesType> {
  /**
   * The callback fired when an item is clicked.
   *
   * @param {SeriesItemIdentifier<SeriesType>} item The clicked item.
   */
  onItemClick?: (item: SeriesItemIdentifier<SeriesType>) => void;
}

export interface UseChartItemClickInstance {
  handleClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

export interface UseChartItemClickState {}

export type UseChartItemClickSignature<SeriesType extends ChartSeriesType = ChartSeriesType> =
  ChartPluginSignature<{
    params: UseChartItemClickParameters<SeriesType>;
    defaultizedParams: UseChartItemClickParameters<SeriesType>;
    instance: UseChartItemClickInstance;
  }>;
