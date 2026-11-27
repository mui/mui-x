import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { warnOnce } from '@mui/x-internals/warning';
import type { DefaultizedBarSeriesType } from '../../../models';
import { getStackingGroups, StackOffset } from '../../../internals/stacking';
import type { DatasetElementType, DatasetType } from '../../../models/seriesType/config';
import type { SeriesId } from '../../../models/seriesType/common';
import type { SeriesProcessor } from '../../../internals/plugins/corePlugins/useChartSeriesConfig';

type BarDataset = DatasetType<number | null>;

const barValueFormatter = ((v) =>
  v == null ? '' : v.toLocaleString()) as DefaultizedBarSeriesType['valueFormatter'];

const seriesProcessor: SeriesProcessor<'bar'> = (params, dataset, isItemVisible) => {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups(params);

  // Create a data set with format adapted to d3
  const d3Dataset: BarDataset = (dataset as BarDataset) ?? [];
  seriesOrder.forEach((id) => {
    const data = series[id].data;
    if (data !== undefined) {
      data.forEach((value, index) => {
        if (d3Dataset.length <= index) {
          d3Dataset.push({ [id]: value });
        } else {
          d3Dataset[index][id] = value;
        }
      });
    } else if (series[id].valueGetter && dataset) {
      // When valueGetter is used without dataKey, populate d3Dataset with the series id as key
      dataset.forEach((entry, index) => {
        const value = series[id].valueGetter!(entry);
        if (d3Dataset.length <= index) {
          d3Dataset.push({ [id]: value });
        } else {
          d3Dataset[index][id] = value;
        }
      });
    } else if (dataset === undefined && process.env.NODE_ENV !== 'production') {
      // TODO: fix mui/no-guarded-throw
      // eslint-disable-next-line mui/no-guarded-throw
      throw new Error(
        `MUI X Charts: Bar series with id="${id}" has no data. ` +
          'The chart cannot render this series without data. ' +
          'Provide a data property to the series or use the dataset prop.',
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      if (!data && dataset) {
        const dataKey = series[id].dataKey;

        if (!dataKey && !series[id].valueGetter) {
          // TODO: fix mui/no-guarded-throw
          // eslint-disable-next-line mui/no-guarded-throw
          throw new Error(
            `MUI X Charts: Bar series with id="${id}" has no data, no dataKey, and no valueGetter. ` +
              'When using the dataset prop, each series must have a dataKey or valueGetter to identify which dataset values to use. ' +
              'Add a dataKey or valueGetter property to the series configuration.',
          );
        }

        if (dataKey) {
          dataset.forEach((entry, index) => {
            const value = entry[dataKey];
            if (value != null && typeof value !== 'number') {
              warnOnce(
                `MUI X Charts: your dataset key "${dataKey}" is used for plotting bars, but the dataset contains the non-null non-numerical element "${value}" at index ${index}.
Bar plots only support numeric and null values.`,
              );
            }
          });
        }
      }
    }
  });

  const completedSeries: {
    [id: string]: DefaultizedBarSeriesType & {
      visibleStackedData: [number, number][];
      stackedData: [number, number][];
    };
  } = {};

  stackingGroups.forEach((stackingGroup) => {
    const { ids, stackingOffset, stackingOrder } = stackingGroup;
    const stackId = series[ids[0]].stack;
    // The stack bottom changes per index, so all series of a stack share one baseline.
    const requestedBaseline = ids
      .map((id) => series[id].baseline)
      .find((value) => value !== undefined);
    // Other offsets don't start the stack at 0, so the bottom bars can't be found.
    const supportsBaseline = stackId === undefined || stackingOffset === StackOffset.diverging;
    const baseline = supportsBaseline ? requestedBaseline : undefined;

    if (process.env.NODE_ENV !== 'production' && requestedBaseline !== undefined) {
      if (!supportsBaseline) {
        warnOnce(
          [
            `MUI X Charts: The \`baseline\` of the bar series in the stack "${stackId}" is ignored because the stack does not use the 'diverging' stack offset.`,
            'Other stack offsets do not start the stack at 0, so the bars at the bottom of the stack cannot be identified.',
            "Remove the `baseline`, or use `stackOffset: 'diverging'` for this stack.",
          ].join('\n'),
        );
      } else if (
        ids.some((id) => series[id].baseline !== undefined && series[id].baseline !== baseline)
      ) {
        warnOnce(
          [
            `MUI X Charts: The bar series of the stack "${stackId}" have different \`baseline\` values.`,
            'A stack can only start from one baseline, so the first one is used for every series of the stack.',
            'Set the same `baseline` on all the series of the stack.',
          ].join('\n'),
        );
      }
    }
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

        if (!isItemVisible?.({ type: 'bar', seriesId })) {
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
      const hidden = !isItemVisible?.({ type: 'bar', seriesId: id });
      completedSeries[id] = {
        layout: 'vertical',
        labelMarkType: 'square',
        minBarSize: 0,
        valueFormatter: series[id].valueFormatter ?? barValueFormatter,
        ...series[id],
        baseline,
        data,
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
};

export default seriesProcessor;
