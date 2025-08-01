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
  tick: 0,
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
  const { scale, tickInterval, tickLabelPlacement, tickPlacement, getGrouping } = options;

  return React.useMemo(() => {
    const domain = scale.domain();
    const filteredDomain =
      (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
      (typeof tickInterval === 'object' && tickInterval) ||
      domain;

    if (scale.bandwidth() > 0) {
      // scale type = 'band'
      const { entries, maxGroupIndex } = mapToGrouping(
        filteredDomain,
        getGrouping,
        tickPlacement ?? 'extremities',
        tickLabelPlacement ?? 'middle',
        scale,
      );

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
    const { entries } = mapToGrouping(
      filteredDomain,
      getGrouping,
      tickPlacement ?? 'extremities',
      tickLabelPlacement ?? 'middle',
      scale,
    );
    return entries;
  }, [scale, tickInterval, getGrouping, tickPlacement, tickLabelPlacement]);
}

function mapToGrouping(
  tickValues: any[],
  getGrouping: AxisGrouping['getGrouping'],
  tickPlacement: Exclude<TickParams['tickPlacement'], undefined>,
  tickLabelPlacement: Exclude<TickParams['tickLabelPlacement'], undefined>,
  scale: D3Scale,
) {
  // Step 1: Create all tick items with their group information
  const allTickItems: Omit<Required<GroupedTickItemType>, 'syncIndex'>[] = [];

  let maxGroupIndex = 0;

  // Build all tick items from the input data
  tickValues.forEach((tickValue, dataIndex) => {
    const groupValues = getGrouping(tickValue, dataIndex);

    groupValues.forEach((groupValue, groupIndex) => {
      maxGroupIndex = Math.max(maxGroupIndex, groupIndex);

      allTickItems.push({
        value: groupValue,
        formattedValue: `${groupValue}`,
        offset: isBandScale(scale)
          ? scale(tickValue)! -
            (scale.step() - scale.bandwidth()) / 2 +
            offsetRatio[tickPlacement] * scale.step()
          : scale(tickValue),
        groupIndex,
        dataIndex,
        ignoreTick: false,
        labelOffset: 0,
      });
    });
  });

  // Step 2: Sort by group index to ensure proper ordering
  allTickItems.sort((a, b) => a.groupIndex - b.groupIndex);

  // Step 3: Process items to create final entries with sync indices and deduplication
  const entries: GroupedTickItemType[] = [];
  const dataIndexToLastEntryMap = new Map<number, number>();
  let currentSyncIndex = -1;

  allTickItems.forEach((item, index) => {
    const previousItem = allTickItems[index - 1];

    // Check if this starts a new sync group
    const isNewSyncGroup =
      index === 0 ||
      item.value !== previousItem.value ||
      item.groupIndex !== previousItem.groupIndex;

    if (isNewSyncGroup) {
      currentSyncIndex += 1;

      // Calculate how many items share this sync index
      const itemsWithSameSyncIndex = allTickItems.filter((otherItem, otherIndex) => {
        // Determine the sync index for this other item
        let otherSyncIndex = -1;

        for (let i = 0; i <= otherIndex; i += 1) {
          const current = allTickItems[i];
          const previous = allTickItems[i - 1];

          if (
            i === 0 ||
            current.value !== previous.value ||
            current.groupIndex !== previous.groupIndex
          ) {
            otherSyncIndex += 1;
          }
        }

        return otherSyncIndex === currentSyncIndex;
      });

      // Calculate the label offset based on the count
      const labelOffset =
        (scale as { step: () => number }).step() *
        itemsWithSameSyncIndex.length *
        (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]);

      // Mark the previous entry from the same data index as ignoreTick
      const previousEntryIndex = dataIndexToLastEntryMap.get(item.dataIndex);
      if (previousEntryIndex !== undefined) {
        entries[previousEntryIndex].ignoreTick = true;
      }

      // Add the new entry
      entries.push({
        ...item,
        syncIndex: currentSyncIndex,
        labelOffset,
      });

      // Track this entry for the data index
      dataIndexToLastEntryMap.set(item.dataIndex, entries.length - 1);
    }
  });

  return {
    entries,
    maxGroupIndex,
  };
}
