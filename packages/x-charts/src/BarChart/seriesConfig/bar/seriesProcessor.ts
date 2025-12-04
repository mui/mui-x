import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { warnOnce } from '@mui/x-internals/warning';
import type { DefaultizedBarSeriesType } from '../../../models';
import { getStackingGroups } from '../../../internals/stackSeries';
import { type DatasetElementType, type DatasetType } from '../../../models/seriesType/config';
import { type SeriesId } from '../../../models/seriesType/common';
import { type SeriesProcessor } from '../../../internals/plugins/models';

type BarDataset = DatasetType<number | null>;

const barValueFormatter = ((v) =>
  v == null ? '' : v.toLocaleString()) as DefaultizedBarSeriesType['valueFormatter'];

const seriesProcessor: SeriesProcessor<'bar'> = (params, dataset, isIdentifierVisible) => {
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
    } else if (dataset === undefined) {
      throw new Error(
        [
          `MUI X Charts: bar series with id='${id}' has no data.`,
          'Either provide a data property to the series or use the dataset prop.',
        ].join('\n'),
      );
    }

    if (process.env.NODE_ENV !== 'production') {
      if (!data && dataset) {
        const dataKey = series[id].dataKey;

        if (!dataKey) {
          throw new Error(
            [
              `MUI X Charts: bar series with id='${id}' has no data and no dataKey.`,
              'You must provide a dataKey when using the dataset prop.',
            ].join('\n'),
          );
        }

        dataset.forEach((entry, index) => {
          const value = entry[dataKey];
          if (value != null && typeof value !== 'number') {
            warnOnce(
              [
                `MUI X Charts: your dataset key "${dataKey}" is used for plotting bars, but the dataset contains the non-null non-numerical element "${value}" at index ${index}.`,
                'Bar plots only support numeric and null values.',
              ].join('\n'),
            );
          }
        });
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

    // We sort the keys based on the original stacking order to ensure consistency
    const idOrder = stackedData.sort((a, b) => a.index - b.index).map((s) => s.key);

    // Compute visible stacked data
    const visibleStackedData = d3Stack<any, DatasetElementType<number | null>, SeriesId>()
      .keys(idOrder)
      .value((d, key) => {
        const keyIndex = keys.indexOf(key);
        const seriesId = ids[keyIndex];

        if (!isIdentifierVisible?.(`${seriesId}`)) {
          // For hidden series, return 0 so they don't contribute to the stack
          return 0;
        }
        return d[key] ?? 0;
      })
      .offset(stackingOffset)(d3Dataset);

    // Post-process visibleStackedData to fix positions for hidden series
    // Hidden series should collapse to the cumulative position of visible series before them
    visibleStackedData.forEach((layer, layerIndex) => {
      const key = idOrder[layerIndex];
      const keyIndex = keys.indexOf(key);
      const seriesId = ids[keyIndex];

      if (!isIdentifierVisible?.(`${seriesId}`)) {
        layer.forEach((point, pointIndex) => {
          // Get the original value to determine if it's negative or positive
          const originalValue = d3Dataset[pointIndex]?.[key] ?? 0;
          const isNegative = originalValue < 0;

          // Calculate the cumulative sum of all visible series before this one
          // Only accumulate values with the same sign
          let cumulativeSum = 0;
          for (let i = 0; i < layerIndex; i += 1) {
            const prevKey = idOrder[i];
            const prevKeyIndex = keys.indexOf(prevKey);
            const prevSeriesId = ids[prevKeyIndex];

            if (isIdentifierVisible?.(`${prevSeriesId}`)) {
              const value = d3Dataset[pointIndex]?.[prevKey] ?? 0;
              const isPrevNegative = value < 0;

              // Only accumulate if both have the same sign
              if (isNegative === isPrevNegative) {
                cumulativeSum += value;
              }
            }
          }

          // Set both start and end to the cumulative position (zero height/width)
          point[0] = cumulativeSum;
          point[1] = cumulativeSum;
        });
      }
    });

    ids.forEach((id, index) => {
      const dataKey = series[id].dataKey;
      const data = dataKey
        ? dataset!.map((d) => {
            const value = d[dataKey];
            return typeof value === 'number' ? value : null;
          })
        : series[id].data!;
      const hidden = !isIdentifierVisible?.(`${id}`);
      completedSeries[id] = {
        layout: 'vertical',
        labelMarkType: 'square',
        minBarSize: 0,
        valueFormatter: series[id].valueFormatter ?? barValueFormatter,
        ...series[id],
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
