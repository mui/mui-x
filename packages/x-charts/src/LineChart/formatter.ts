import {
  stack as d3Stack,
  stackOrderNone as d3StackOrderNone,
  stackOffsetNone as d3StackOffsetNone,
} from 'd3-shape';
import defaultizeCartesianSeries from '../internals/defaultizeCartesianSeries';
import { getStackingGroups } from '../internals/stackSeries';
import { LineSeriesType } from '../models/seriesType';

export type FormatterParams = { series: { [id: string]: LineSeriesType }; seriesOrder: string[] };

export interface StackedLineSeriesType extends LineSeriesType {
  stackedData: [number, number][];
}

export type FormatterResult = {
  series: { [id: string]: StackedLineSeriesType };
  seriesOrder: string[];
  stackingGroups: string[][];
};

// For now it's a copy past of bar charts formatter, but maybe will diverge later
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

  const complettedSeries: FormatterResult['series'] = {};

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

  return { seriesOrder, stackingGroups, series: defaultizeCartesianSeries(complettedSeries) };
};

export default formatter;
