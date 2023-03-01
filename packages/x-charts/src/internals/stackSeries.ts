import {
  stack as d3Stack,
  stackOrderNone as d3StackOrderNone,
  stackOffsetNone as d3StackOffsetNone,
} from 'd3-shape';
import { StackableSeriesType } from '../models/seriesType';

const stackSeries = <SeriesT extends StackableSeriesType>(
  series: SeriesT[],
): [{ [seriesId: string]: [number, number][] }, number[][]] => {
  const stackedData: { [seriesId: string]: [number, number][] } = {};
  const groupedIndexes: number[][] = [];

  series.forEach(({ stack, id, ...other }, itemIndex) => {
    if (!stack) {
      stackedData[id] = other.data.map((value) => [0, value]);
      groupedIndexes.push([itemIndex]);
      return;
    }
    if (stackedData[id] !== undefined) {
      return; // Already done
    }

    const dataToStack: any[] = [];
    series
      .filter((item) => item.stack === stack)
      .forEach((item) => {
        item.data.forEach((value, index) => {
          if (dataToStack[index] === undefined) {
            dataToStack.push({ [item.id]: value });
          } else {
            dataToStack[index][item.id] = value;
          }
        });
      });
    const stackedSeriesIndexes: number[] = [];
    const stackedSeriesIds = series
      .filter((item, index) => {
        if (item.stack === stack) {
          stackedSeriesIndexes.push(index);
          return true;
        }
        return false;
      })
      .map((item) => item.id);

    groupedIndexes.push(stackedSeriesIndexes);
    const stackedSeries = d3Stack()
      .keys(stackedSeriesIds)
      .order(d3StackOrderNone)
      .offset(d3StackOffsetNone)(dataToStack);

    stackedSeriesIds.forEach((seriesId, index) => {
      stackedData[seriesId] = stackedSeries[index].map(([a, b]) => [a, b]);
    });
  });

  return [stackedData, groupedIndexes];
};

export default stackSeries;
