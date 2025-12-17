'use client';
import { useStore } from '../internals/store/useStore';
import { selectorChartDataset } from '../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors';
import { type UseChartSeriesSignature } from '../internals/plugins/corePlugins/useChartSeries';
import { type DatasetType } from '../models/seriesType/config';

/**
 * Get access to the dataset used to populate series and axes data.
 * @returns {DatasetType | undefined} The dataset array if provided, otherwise undefined.
 */
export function useDataset<T extends DatasetType>(): Readonly<T> | undefined {
  const store = useStore<[UseChartSeriesSignature]>();
  return store.use(selectorChartDataset) as T | undefined;
}
