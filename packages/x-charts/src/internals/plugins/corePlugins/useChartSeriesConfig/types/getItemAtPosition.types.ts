import type { SeriesItemIdentifierWithType } from '../../../../../models/seriesType';
import type { ChartState } from '../../../models/chart';
import type { ChartSeriesType } from '../../../../../models/seriesType/config';
import type { UseChartCartesianAxisSignature } from '../../../featurePlugins/useChartCartesianAxis';
import type { UseChartPolarAxisSignature } from '../../../featurePlugins/useChartPolarAxis';

export type GetItemAtPosition<SeriesType extends ChartSeriesType> = (
  state: ChartState<[UseChartCartesianAxisSignature, UseChartPolarAxisSignature]>,
  point: { x: number; y: number },
) => SeriesItemIdentifierWithType<SeriesType> | undefined;
