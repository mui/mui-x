import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { warnOnce } from '@mui/x-internals/warning';
import { getStackingGroups } from '@mui/x-charts/internals';
import type {
  SeriesProcessorParams,
  SeriesProcessorResult,
  IsItemVisibleFunction,
  ChartSeriesDefaultized,
  DatasetElementType,
  DatasetType,
} from '@mui/x-charts/internals';
import type { SeriesId, MarkShape } from '@mui/x-charts/models';
import type { DefaultizedRadialLineSeriesType } from '../../models/seriesType/radialLine';

const defaultShapes: MarkShape[] = [
  'circle',
  'square',
  'diamond',
  'cross',
  'star',
  'triangle',
  'wye',
];

const lineValueFormatter = ((v) =>
  v == null ? '' : v.toLocaleString()) as DefaultizedRadialLineSeriesType['valueFormatter'];

function seriesProcessor(
  params: SeriesProcessorParams<'radial-line'>,
  dataset?: Readonly<DatasetType>,
  isItemVisible?: IsItemVisibleFunction,
): SeriesProcessorResult<'radial-line'> {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups({ ...params, defaultStrategy: { stackOffset: 'none' } });

  const idToIndex: Map<SeriesId, number> = new Map();
  // Create a data set with format adapted to d3
  const d3Dataset: DatasetType<number | null> = (dataset as DatasetType<number | null>) ?? [];
  seriesOrder.forEach((id, seriesIndex) => {
    idToIndex.set(id, seriesIndex);
    const data = series[id].data;
    if (data !== undefined) {
      data.forEach((value, dataIndex) => {
        if (d3Dataset.length <= dataIndex) {
          d3Dataset.push({ [id]: value });
        } else {
          d3Dataset[dataIndex][id] = value;
        }
      });
    } else if (series[id].valueGetter && dataset) {
      // When valueGetter is used without dataKey, populate d3Dataset with the series id as key
      dataset.forEach((entry, dataIndex) => {
        const value = series[id].valueGetter!(entry);
        if (d3Dataset.length <= dataIndex) {
          d3Dataset.push({ [id]: value });
        } else {
          d3Dataset[dataIndex][id] = value;
        }
      });
    } else if (dataset === undefined && process.env.NODE_ENV !== 'production') {
      throw new Error(
        `MUI X Charts: Radial line series with id="${id}" has no data. ` +
          'The chart cannot render this series without data. ' +
          'Provide a data property to the series or use the dataset prop.',
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      if (!data && dataset) {
        const dataKey = series[id].dataKey;

        if (!dataKey && !series[id].valueGetter) {
          throw new Error(
            `MUI X Charts: Radial line series with id="${id}" has no data, no dataKey, and no valueGetter. ` +
              'When using the dataset prop, each series must have a dataKey or valueGetter to identify which dataset values to use. ' +
              'Add a dataKey or valueGetter property to the series configuration.',
          );
        }

        if (dataKey) {
          dataset.forEach((entry, index) => {
            const value = entry[dataKey];
            if (value != null && typeof value !== 'number') {
              warnOnce(
                `MUI X Charts: your dataset key "${dataKey}" is used for plotting radial lines, but the dataset contains the non-null non-numerical element "${value}" at index ${index}.
Radial line plots only support numeric and null values.`,
              );
            }
          });
        }
      }
    }
  });

  const completedSeries: Record<SeriesId, ChartSeriesDefaultized<'radial-line'>> = {};

  stackingGroups.forEach((stackingGroup) => {
    const { ids, stackingOffset, stackingOrder } = stackingGroup;
    const keys = ids.map((id) => {
      // Use dataKey if needed and available
      const dataKey = series[id].dataKey;
      return series[id].data === undefined && dataKey !== undefined ? dataKey : id;
    });

    const stackedData = d3Stack<any, DatasetElementType<number | null>, SeriesId>()
      .keys(keys)
      .value((d, key) => d[key] ?? 0) // defaultize null value to 0
      .order(stackingOrder)
      .offset(stackingOffset)(d3Dataset);

    const idOrder = stackedData.map((s) => s.index);
    const fixedOrder = () => idOrder;

    // Compute visible stacked data
    const visibleStackedData = d3Stack<any, DatasetElementType<number | null>, SeriesId>()
      .keys(keys)
      .value((d, key) => {
        const keyIndex = keys.indexOf(key);
        const seriesId = ids[keyIndex];

        if (!isItemVisible?.({ type: 'radial-line', seriesId })) {
          // For hidden series, return 0 so they don't contribute to the stack
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
      const hidden = !isItemVisible?.({ type: 'radial-line', seriesId: id });
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
}

export default seriesProcessor;
