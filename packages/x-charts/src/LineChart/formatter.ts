import { stack as d3Stack } from 'd3-shape';
import { getStackingGroups } from '../internals/stackSeries';
import { ChartSeries, Formatter } from '../models/seriesType/config';
import defaultizeValueFormatter from '../internals/defaultizeValueFormatter';
import { DefaultizedProps } from '../models/helpers';

// For now it's a copy past of bar charts formatter, but maybe will diverge later
const formatter: Formatter<'line'> = (params, dataset) => {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups(params);

  // Create a data set with format adapted to d3
  const d3Dataset: { [id: string]: number | null }[] = dataset ?? [];
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
    } else if (dataset === undefined && process.env.NODE_ENV !== 'production') {
      throw new Error(
        [
          `MUI: line series with id='${id}' has no data.`,
          'Either provide a data property to the series or use the dataset prop.',
        ].join('\n'),
      );
    }
  });

  const completedSeries: { [id: string]: DefaultizedProps<ChartSeries<'line'>, 'data'> } = {};

  stackingGroups.forEach((stackingGroup) => {
    // Get stacked values, and derive the domain
    const { ids, stackingOrder, stackingOffset } = stackingGroup;
    const stackedSeries = d3Stack<any, { [id: string]: number | null }, string>()
      .keys(
        ids.map((id) => {
          // Use dataKey if needed and available
          const dataKey = series[id].dataKey;
          return series[id].data === undefined && dataKey !== undefined ? dataKey : id;
        }),
      )
      .value((d, key) => d[key] ?? 0) // defaultize null value to 0
      .order(stackingOrder)
      .offset(stackingOffset)(d3Dataset);

    ids.forEach((id, index) => {
      const dataKey = series[id].dataKey;
      completedSeries[id] = {
        ...series[id],
        data: dataKey ? dataset!.map((d) => d[dataKey]) : series[id].data!,
        stackedData: stackedSeries[index].map(([a, b]) => [a, b]),
      };
    });
  });

  return {
    seriesOrder,
    stackingGroups,
    series: defaultizeValueFormatter(completedSeries, (v) => v?.toLocaleString()),
  };
};

export default formatter;
