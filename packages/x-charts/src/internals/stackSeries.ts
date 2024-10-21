import {
  stackOrderAppearance as d3StackOrderAppearance,
  stackOrderAscending as d3StackOrderAscending,
  stackOrderDescending as d3StackOrderDescending,
  stackOrderInsideOut as d3StackOrderInsideOut,
  stackOrderNone as d3StackOrderNone,
  stackOrderReverse as d3StackOrderReverse,
  stackOffsetExpand as d3StackOffsetExpand,
  stackOffsetDiverging as d3StackOffsetDiverging,
  stackOffsetNone as d3StackOffsetNone,
  stackOffsetSilhouette as d3StackOffsetSilhouette,
  stackOffsetWiggle as d3StackOffsetWiggle,
  Series,
} from '@mui/x-charts-vendor/d3-shape';
import type { BarSeriesType, LineSeriesType } from '../models/seriesType';
import type { StackOffsetType, StackOrderType } from '../models/stacking';
import { SeriesId } from '../models/seriesType/common';

type StackableSeries = Record<SeriesId, BarSeriesType> | Record<SeriesId, LineSeriesType>;

type FormatterParams = {
  series: StackableSeries;
  seriesOrder: SeriesId[];
  defaultStrategy?: {
    stackOrder?: StackOrderType;
    stackOffset?: StackOffsetType;
  };
};

export type StackingGroupsType = {
  ids: SeriesId[];
  stackingOrder: (series: Series<any, any>) => number[];
  stackingOffset: (series: Series<any, any>, order: Iterable<number>) => void;
}[];

export const StackOrder: {
  [key in StackOrderType]: (series: Series<any, any>) => number[];
} = {
  /**
   * Series order such that the earliest series (according to the maximum value) is at the bottom.
   * */
  appearance: d3StackOrderAppearance,
  /**
   *  Series order such that the smallest series (according to the sum of values) is at the bottom.
   * */
  ascending: d3StackOrderAscending,
  /**
   * Series order such that the largest series (according to the sum of values) is at the bottom.
   */
  descending: d3StackOrderDescending,
  /**
   * Series order such that the earliest series (according to the maximum value) are on the inside and the later series are on the outside. This order is recommended for streamgraphs in conjunction with the wiggle offset. See Stacked Graphs—Geometry & Aesthetics by Byron & Wattenberg for more information.
   */
  insideOut: d3StackOrderInsideOut,
  /**
   * Given series order [0, 1, … n - 1] where n is the number of elements in series. Thus, the stack order is given by the key accessor.
   */
  none: d3StackOrderNone,
  /**
   * Reverse of the given series order [n - 1, n - 2, … 0] where n is the number of elements in series. Thus, the stack order is given by the reverse of the key accessor.
   */
  reverse: d3StackOrderReverse,
};

export const StackOffset: {
  [key in StackOffsetType]: (series: Series<any, any>, order: Iterable<number>) => void;
} = {
  /**
   * Applies a zero baseline and normalizes the values for each point such that the topline is always one.
   * */
  expand: d3StackOffsetExpand,
  /**
   * Positive values are stacked above zero, negative values are stacked below zero, and zero values are stacked at zero.
   * */
  diverging: d3StackOffsetDiverging,
  /**
   * Applies a zero baseline.
   * */
  none: d3StackOffsetNone,
  /**
   * Shifts the baseline down such that the center of the streamgraph is always at zero.
   * */
  silhouette: d3StackOffsetSilhouette,
  /**
   * Shifts the baseline so as to minimize the weighted wiggle of layers. This offset is recommended for streamgraphs in conjunction with the inside-out order. See Stacked Graphs—Geometry & Aesthetics by Bryon & Wattenberg for more information.
   * */
  wiggle: d3StackOffsetWiggle,
};

/**
 * Takes a set of series and groups their ids
 * @param series the object of all bars series
 * @returns an array of groups, including the ids, the stacking order, and the stacking offset.
 */
export const getStackingGroups = (params: FormatterParams) => {
  const { series, seriesOrder, defaultStrategy } = params;

  const stackingGroups: StackingGroupsType = [];
  const stackIndex: Record<SeriesId, number> = {};

  seriesOrder.forEach((id) => {
    const { stack, stackOrder, stackOffset } = series[id];

    if (stack === undefined) {
      stackingGroups.push({
        ids: [id],
        stackingOrder: StackOrder.none,
        stackingOffset: StackOffset.none,
      });
    } else if (stackIndex[stack] === undefined) {
      stackIndex[stack] = stackingGroups.length;
      stackingGroups.push({
        ids: [id],
        stackingOrder: StackOrder[stackOrder ?? defaultStrategy?.stackOrder ?? 'none'],
        stackingOffset: StackOffset[stackOffset ?? defaultStrategy?.stackOffset ?? 'diverging'],
      });
    } else {
      stackingGroups[stackIndex[stack]].ids.push(id);
      if (stackOrder !== undefined) {
        stackingGroups[stackIndex[stack]].stackingOrder = StackOrder[stackOrder];
      }
      if (stackOffset !== undefined) {
        stackingGroups[stackIndex[stack]].stackingOffset = StackOffset[stackOffset];
      }
    }
  });

  return stackingGroups;
};
