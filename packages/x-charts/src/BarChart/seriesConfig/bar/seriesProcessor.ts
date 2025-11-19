import { stack as d3Stack } from '@mui/x-charts-vendor/d3-shape';
import { warnOnce } from '@mui/x-internals/warning';
import type { DefaultizedBarSeriesType } from '../../../models';
import { getStackingGroups } from '../../../internals/stackSeries';
import { DatasetElementType, DatasetType } from '../../../models/seriesType/config';
import { SeriesId } from '../../../models/seriesType/common';
import { SeriesProcessor } from '../../../internals/plugins/models';

type BarDataset = DatasetType<number | null>;

const barValueFormatter = ((v) =>
  v == null ? '' : v.toLocaleString()) as DefaultizedBarSeriesType['valueFormatter'];

const seriesProcessor: SeriesProcessor<'bar'> = (params, dataset, hiddenIdentifiers) => {
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
      fullStackedData: [number, number][];
    };
  } = {};

  stackingGroups.forEach((stackingGroup) => {
    const { ids, stackingOffset, stackingOrder } = stackingGroup;
    const hiddenIds = new Set(hiddenIdentifiers?.map((v) => v.seriesId));
    const keys = ids.map((id) => {
      // Use dataKey if needed and available
      const dataKey = series[id].dataKey;
      return series[id].data === undefined && dataKey !== undefined ? dataKey : id;
    });

    const stackedSeries = d3Stack<any, DatasetElementType<number | null>, SeriesId>()
      .keys(keys)
      .value((d, key) => d[key] ?? 0) // defaultize null value to 0
      .order(stackingOrder)
      .offset(stackingOffset)(d3Dataset);

    const fullStackedData = stackedSeries.map((layer) =>
      layer.map((point) => [point[0], point[1]] as [number, number]),
    );

    // This is a bit complex: we need to create a version of the stacked data
    // where the hidden series are replaced by 0-height bars, but the other
    // series keep their original height (i.e. the space taken by the hidden
    // series is removed from the chart).
    //
    // To do that, we iterate over each layer, and for each hidden series,
    // we compute the diff between its start and end values, and remove that
    // diff from all the upper layers.
    //
    // This way, when we draw the visible series, they will be stacked
    // correctly without gaps.
    const visibleStackedData: [number, number][][] = stackedSeries as [number, number][][];
    for (let layerIndex = 0; layerIndex < visibleStackedData.length; layerIndex += 1) {
      const layer = visibleStackedData[layerIndex];
      const layerResult = { ...layer };
      for (let pointIndex = 0; pointIndex < layer.length; pointIndex += 1) {
        const point = layer[pointIndex];
        const id = ids[layerIndex];
        const isHidden = hiddenIds.has(id);

        if (isHidden) {
          const diff = point[1] - point[0];
          // Remove the diff from all the upper layers
          for (let j = layerIndex + 1; j < visibleStackedData.length; j += 1) {
            const upperPoint = visibleStackedData[j][pointIndex];

            upperPoint[0] -= diff;
            upperPoint[1] -= diff;
          }
          layerResult[pointIndex][0] = point[0];
          layerResult[pointIndex][1] = point[0];
        } else {
          layerResult[pointIndex][0] = point[0];
          layerResult[pointIndex][1] = point[1];
        }
      }
      visibleStackedData[layerIndex] = layerResult;
    }

    ids.forEach((id, index) => {
      const dataKey = series[id].dataKey;
      const data = dataKey
        ? dataset!.map((d) => {
            const value = d[dataKey];
            return typeof value === 'number' ? value : null;
          })
        : series[id].data!;
      completedSeries[id] = {
        layout: 'vertical',
        labelMarkType: 'square',
        minBarSize: 0,
        valueFormatter: series[id].valueFormatter ?? barValueFormatter,
        ...series[id],
        data,
        fullStackedData: fullStackedData[index],
        visibleStackedData: visibleStackedData[index],
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
