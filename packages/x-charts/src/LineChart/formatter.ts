import { stack as d3Stack } from 'd3-shape';
import { getStackingGroups } from '../internals/stackSeries';
import { ChartSeries, Formatter } from '../models/seriesType/config';
import defaultizeValueFormatter from '../internals/defaultizeValueFormatter';

// For now it's a copy past of bar charts formatter, but maybe will diverge later
const formatter: Formatter<'line'> = (params) => {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups(params);

  // Create a data set with format adapted to d3
  const d3Dataset: { [id: string]: number }[] = [];
  seriesOrder.forEach((id) => {
    series[id].data.forEach((value, index) => {
      if (d3Dataset.length <= index) {
        d3Dataset.push({ [id]: value });
      } else {
        d3Dataset[index][id] = value;
      }
    });
  });

  const completedSeries: { [id: string]: ChartSeries<'line'> } = {};

  stackingGroups.forEach((stackingGroup) => {
    // Get stacked values, and derive the domain
    const { ids, stackingOrder, stackingOffset } = stackingGroup;
    const stackedSeries = d3Stack().keys(ids).order(stackingOrder).offset(stackingOffset)(
      d3Dataset,
    );

    ids.forEach((id, index) => {
      completedSeries[id] = {
        ...series[id],
        stackedData: stackedSeries[index].map(([a, b]) => [a, b]),
      };
    });
  });

  return {
    seriesOrder,
    stackingGroups,
    series: defaultizeValueFormatter(completedSeries, (v) => v.toLocaleString()),
  };
};

export default formatter;
