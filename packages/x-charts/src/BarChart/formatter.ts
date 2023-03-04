import {
  stack as d3Stack,
  stackOrderNone as d3StackOrderNone,
  stackOffsetNone as d3StackOffsetNone,
} from 'd3-shape';
import { BarSeriesType } from '../models/seriesType';

type FormatterParams = { series: { [id: string]: BarSeriesType }; seriesOrder: string[] };

interface StackedBarSeriesType extends BarSeriesType {
  stackedData: [number, number][];
}

type FormatterResult = {
  series: { [id: string]: StackedBarSeriesType };
  seriesOrder: string[];
  stackingGroups: string[][];
};

/**
 * Takes a set of series and group their ids
 * @param series the object of all bars series
 * @returns an array of array of ids grouped by stacking groups
 */
const getStackingGroups = (params: FormatterParams) => {
  const { series, seriesOrder } = params;

  const stackingGroups: string[][] = [];
  const stackIndex = {};

  seriesOrder.forEach((id) => {
    const stack = series[id].stack;
    if (stack === undefined) {
      stackingGroups.push([id]);
    } else if (stackIndex[stack] === undefined) {
      stackIndex[stack] = stackingGroups.length;
      stackingGroups.push([id]);
    } else {
      stackingGroups[stackIndex[stack]].push(id);
    }
  });

  return stackingGroups;
};

const formatter = (params: FormatterParams): FormatterResult => {
  const { seriesOrder, series } = params;
  const stackingGroups = getStackingGroups(params);

  // Create a data set with format addapted to d3
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

  const complettedSeries = {};

  stackingGroups.forEach((stackingGroup) => {
    // Get stacked values, and derive the domain
    const stackedSeries = d3Stack()
      .keys(stackingGroup)
      .order(d3StackOrderNone)
      .offset(d3StackOffsetNone)(d3Dataset);

    stackingGroup.forEach((id, index) => {
      complettedSeries[id] = {
        ...series[id],
        stackedData: stackedSeries[index].map(([a, b]) => [a, b]),
      };
    });
  });

  return { seriesOrder, stackingGroups, series: complettedSeries };
};

export default formatter;
