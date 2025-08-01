'use client';
import * as React from 'react';
import type { ScaleBand, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { AxisConfig, D3Scale, type AxisGrouping } from '../models/axis';
import { isBandScale } from '../internals/isBandScale';
import type { TickParams } from './useTicks';

const offsetRatio = {
  start: 0,
  extremities: 0,
  end: 1,
  middle: 0.5,
} as const;

export type GroupedTickItemType = {
  /**
   * This property is undefined only if it's the tick closing the last band
   */
  value?: any;
  formattedValue?: string;
  offset: number;
  labelOffset: number;
  /**
   * In band scales, we remove some redundant ticks.
   */
  ignoreTick?: boolean;
  dataIndex?: number;
  /**
   * The index of the group this tick belongs to. If `getGrouping` returns `[[0, 1], [2, 3]]`
   * both ticks with value `0` and `2` will have `groupIndex: 0`, and both ticks with value `1` and `3` will have `groupIndex: 1`.
   */
  groupIndex?: number;
  /**
   * The index of the tick group inside the group. This is useful if you have multiple ticks with the same value,
   * but they are divided by other values. Eg: `'Jan', ..., 'Dec', 'Jan'`
   * We would have the first `'Jan'` with `syncIndex: 0` and `syncIndex: 12` for the second `'Jan'`.
   */
  syncIndex?: number;
};

export function useTicksGrouped(
  options: {
    scale: ScaleBand<any> | ScalePoint<any>;
    valueFormatter?: AxisConfig['valueFormatter'];
    direction: 'x' | 'y';
    getGrouping: AxisGrouping['getGrouping'];
  } & Pick<TickParams, 'tickNumber' | 'tickInterval' | 'tickPlacement' | 'tickLabelPlacement'>,
): GroupedTickItemType[] {
  const { scale, tickInterval, getGrouping } = options;

  return React.useMemo(() => {
    const domain = scale.domain();
    const filteredDomain =
      (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
      (typeof tickInterval === 'object' && tickInterval) ||
      domain;

    if (scale.bandwidth() > 0) {
      // scale type = 'band'
      const { entries, maxGroupIndex } = mapToGrouping(filteredDomain, getGrouping, scale);

      entries[0].ignoreTick = true;

      return [
        {
          formattedValue: undefined,
          offset: scale.range()[0],
          labelOffset: 0,
          groupIndex: maxGroupIndex,
        },

        ...entries,

        // Last tick
        {
          formattedValue: undefined,
          offset: scale.range()[1],
          labelOffset: 0,
          groupIndex: maxGroupIndex,
        },
      ];
    }

    // scale type = 'point'
    const { entries } = mapToGrouping(filteredDomain, getGrouping, scale);
    return entries;
  }, [scale, tickInterval, getGrouping]);
}

function mapToGrouping(
  tickValues: any[],
  getGrouping: AxisGrouping['getGrouping'],
  scale: D3Scale,
) {
  let syncIndex = -1;
  let maxGroupIndex = 0;
  const entries = tickValues
    .flatMap((value, i) => {
      return getGrouping(value, i).map((groupValue, groupIndex) => ({
        value: groupValue,
        formattedValue: `${groupValue}`,
        offset: isBandScale(scale)
          ? scale(value)! -
            (scale.step() - scale.bandwidth()) / 2 +
            offsetRatio.extremities * scale.step()
          : scale(value),
        groupIndex,
        dataIndex: i,
        labelOffset: 0,
      }));
    })
    .sort((a, b) => a.groupIndex - b.groupIndex)
    .map((item, index, arr) => {
      if (
        index === 0 ||
        item.value !== arr[index - 1]?.value ||
        item.groupIndex !== arr[index - 1]?.groupIndex
      ) {
        syncIndex += 1;
      }
      if (item.groupIndex > maxGroupIndex) {
        maxGroupIndex = item.groupIndex;
      }

      return {
        ...item,
        syncIndex,
      };
    })
    .reduce((acc, item, index, arr) => {
      if (
        index === 0 ||
        item.value !== arr[index - 1].value ||
        item.groupIndex !== arr[index - 1].groupIndex
      ) {
        const count = arr.filter((v) => v.syncIndex === item.syncIndex).length;
        const labelOffset =
          (scale as { step: () => number }).step() *
          count *
          (offsetRatio.middle - offsetRatio.extremities);
        const lastIndex = acc.findLastIndex((v) => v.dataIndex === item.dataIndex);
        if (lastIndex > -1) {
          acc[lastIndex].ignoreTick = true;
        }
        item.labelOffset = labelOffset;
        acc.push(item);
      }
      return acc;
    }, [] as GroupedTickItemType[]);

  return {
    entries,
    maxGroupIndex,
  };
}
