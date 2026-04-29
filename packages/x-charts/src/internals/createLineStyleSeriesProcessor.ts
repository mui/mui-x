import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { warnOnce } from '@mui/x-internals/warning';
import { getStackingGroups } from './stacking';
import type { DatasetElementType, DatasetType, ChartSeriesType } from '../models/seriesType/config';
import type { SeriesId } from '../models/seriesType/common';
import type { MarkShape } from '../models/seriesType/line';
import type { SeriesProcessor } from './plugins/corePlugins/useChartSeriesConfig';
import type { IsItemVisibleFunction } from './plugins/featurePlugins/useChartVisibilityManager';

const defaultShapes: MarkShape[] = [
  'circle',
  'square',
  'diamond',
  'cross',
  'star',
  'triangle',
  'wye',
];

export function createLineStyleSeriesProcessor<T extends ChartSeriesType>(
  seriesType: T,
  chartName: string,
): SeriesProcessor<T> {
  const lineValueFormatter = (v: number | null) => (v == null ? '' : v.toLocaleString());

  return ((params: any, dataset?: Readonly<DatasetType>, isItemVisible?: IsItemVisibleFunction) => {
    const { seriesOrder, series } = params;
    const stackingGroups = getStackingGroups({
      ...params,
      defaultStrategy: { stackOffset: 'none' },
    } as any);

    const idToIndex: Map<SeriesId, number> = new Map();
    const d3Dataset: DatasetType<number | null> = (dataset as DatasetType<number | null>) ?? [];
    seriesOrder.forEach((id: SeriesId, seriesIndex: number) => {
      idToIndex.set(id, seriesIndex);
      const s = series[id];
      const data = s.data;
      if (data !== undefined) {
        data.forEach((value: number | null, dataIndex: number) => {
          if (d3Dataset.length <= dataIndex) {
            d3Dataset.push({ [id]: value });
          } else {
            d3Dataset[dataIndex][id] = value;
          }
        });
      } else if (s.valueGetter && dataset) {
        dataset.forEach((entry, dataIndex) => {
          const value = s.valueGetter!(entry);
          if (d3Dataset.length <= dataIndex) {
            d3Dataset.push({ [id]: value });
          } else {
            d3Dataset[dataIndex][id] = value;
          }
        });
      } else if (dataset === undefined && process.env.NODE_ENV !== 'production') {
        throw new Error(
          `MUI X Charts: ${chartName} series with id="${id}" has no data. ` +
            'The chart cannot render this series without data. ' +
            'Provide a data property to the series or use the dataset prop.',
        );
      }

      if (process.env.NODE_ENV !== 'production') {
        if (!data && dataset) {
          const dataKey = s.dataKey;

          if (!dataKey && !s.valueGetter) {
            throw new Error(
              `MUI X Charts: ${chartName} series with id="${id}" has no data, no dataKey, and no valueGetter. ` +
                'When using the dataset prop, each series must have a dataKey or valueGetter to identify which dataset values to use. ' +
                'Add a dataKey or valueGetter property to the series configuration.',
            );
          }

          if (dataKey) {
            dataset.forEach((entry, index) => {
              const value = entry[dataKey];
              if (value != null && typeof value !== 'number') {
                warnOnce(
                  `MUI X Charts: your dataset key "${dataKey}" is used for plotting ${chartName.toLowerCase()} series, but the dataset contains the non-null non-numerical element "${value}" at index ${index}.\n${chartName} plots only support numeric and null values.`,
                );
              }
            });
          }
        }
      }
    });

    const completedSeries: Record<SeriesId, any> = {};

    stackingGroups.forEach((stackingGroup) => {
      const { ids, stackingOffset, stackingOrder } = stackingGroup;
      const keys = ids.map((id) => {
        const dataKey = series[id].dataKey;
        return series[id].data === undefined && dataKey !== undefined ? dataKey : id;
      });

      const stackedData = d3Stack<any, DatasetElementType<number | null>, SeriesId>()
        .keys(keys)
        .value((d, key) => d[key] ?? 0)
        .order(stackingOrder)
        .offset(stackingOffset)(d3Dataset);

      const idOrder = stackedData.map((s) => s.index);
      const fixedOrder = () => idOrder;

      const visibleStackedData = d3Stack<any, DatasetElementType<number | null>, SeriesId>()
        .keys(keys)
        .value((d, key) => {
          const keyIndex = keys.indexOf(key);
          const seriesId = ids[keyIndex];

          if (!isItemVisible?.({ type: seriesType, seriesId } as any)) {
            return 0;
          }
          return d[key] ?? 0;
        })
        .order(fixedOrder)
        .offset(stackingOffset)(d3Dataset);

      ids.forEach((id, index) => {
        const { dataKey, valueGetter } = series[id];

        let data: readonly (number | null)[];
        if (valueGetter) {
          data = dataset!.map((d) => valueGetter(d));
        } else if (dataKey) {
          data = dataset!.map((d) => {
            const value = d[dataKey];
            return typeof value === 'number' ? value : null;
          });
        } else {
          data = series[id].data!;
        }
        const hidden = !isItemVisible?.({ type: seriesType, seriesId: id } as any);
        completedSeries[id] = {
          labelMarkType: 'line+mark',
          ...series[id],
          shape: series[id].shape ?? defaultShapes[(idToIndex.get(id) ?? 0) % defaultShapes.length],
          data,
          valueFormatter: series[id].valueFormatter ?? lineValueFormatter,
          hidden,
          stackedData: stackedData[index] as [number, number][],
          visibleStackedData: visibleStackedData[index] as [number, number][],
        };
      });
    });

    return {
      seriesOrder,
      stackingGroups,
      series: completedSeries,
    };
  }) as SeriesProcessor<T>;
}
