'use client';
import * as React from 'react';
import type { ScaleBand, ScalePoint } from '@mui/x-charts-vendor/d3-scale';
import { type AxisConfig, type D3Scale, type AxisGroup } from '../models/axis';
import { isOrdinalScale } from '../internals/scaleGuards';
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
};

export function useTicksGrouped(
  options: {
    scale: ScaleBand<any> | ScalePoint<any>;
    valueFormatter?: AxisConfig['valueFormatter'];
    direction: 'x' | 'y';
    groups: AxisGroup[];
  } & Pick<TickParams, 'tickNumber' | 'tickInterval' | 'tickPlacement' | 'tickLabelPlacement'>,
): GroupedTickItemType[] {
  const {
    scale,
    tickInterval,
    tickLabelPlacement = 'middle',
    tickPlacement = 'extremities',
    groups,
  } = options;

  return React.useMemo(() => {
    const domain = scale.domain();
    const filteredDomain =
      (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
      (typeof tickInterval === 'object' && tickInterval) ||
      domain;

    if (scale.bandwidth() > 0) {
      // scale type = 'band'
      const entries = mapToGrouping(
        filteredDomain,
        groups,
        tickPlacement,
        tickLabelPlacement,
        scale,
      );

      if (entries[0]) {
        entries[0].ignoreTick = true;
      }

      return [
        {
          formattedValue: undefined,
          offset: scale.range()[0],
          labelOffset: 0,
          groupIndex: groups.length - 1,
        },

        ...entries,

        // Last tick
        {
          formattedValue: undefined,
          offset: scale.range()[1],
          labelOffset: 0,
          groupIndex: groups.length - 1,
        },
      ];
    }

    // scale type = 'point'
    return mapToGrouping(filteredDomain, groups, tickPlacement, tickLabelPlacement, scale);
  }, [scale, tickInterval, groups, tickPlacement, tickLabelPlacement]);
}

function mapToGrouping(
  tickValues: any[],
  groups: AxisGroup[],
  tickPlacement: Exclude<TickParams['tickPlacement'], undefined>,
  tickLabelPlacement: Exclude<TickParams['tickLabelPlacement'], undefined>,
  scale: D3Scale,
) {
  const allTickItems: GroupedTickItemType[] = [];
  // Map to keep track of offsets and their corresponding tick indexes
  // Used to remove redundant ticks when they are in the same position
  const dataIndexToTickIndex = new Map<number, Set<number>>();

  let currentValueCount = 0;

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
    for (let dataIndex = 0; dataIndex < tickValues.length; dataIndex += 1) {
      const tickValue = tickValues[dataIndex];
      const groupValue = groups[groupIndex].getValue(tickValue, dataIndex);
      const lastItem = allTickItems[allTickItems.length - 1];

      // Check if this is a new unique value for this group
      const isNew = lastItem?.value !== groupValue || lastItem?.groupIndex !== groupIndex;

      if (isNew) {
        currentValueCount = 1;
        // Calculate tick offset
        const tickOffset = isOrdinalScale(scale)
          ? scale(tickValue)! -
            (scale.step() - scale.bandwidth()) / 2 +
            offsetRatio[tickPlacement] * scale.step()
          : scale(tickValue);

        // Calculate the label offset
        const labelOffset =
          (scale as { step: () => number }).step() *
          currentValueCount *
          (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]);

        // Add a new item
        allTickItems.push({
          value: groupValue,
          formattedValue: `${groupValue}`,
          offset: tickOffset,
          groupIndex,
          dataIndex,
          ignoreTick: false,
          labelOffset,
        });

        if (!dataIndexToTickIndex.has(dataIndex)) {
          dataIndexToTickIndex.set(dataIndex, new Set());
        }

        const tickIndexes = dataIndexToTickIndex.get(dataIndex)!;

        for (const previousIndex of tickIndexes.values()) {
          allTickItems[previousIndex].ignoreTick = true;
        }

        tickIndexes.add(allTickItems.length - 1);
      } else {
        currentValueCount += 1;

        // Calculate the label offset
        const labelOffset =
          (scale as { step: () => number }).step() *
          currentValueCount *
          (offsetRatio[tickLabelPlacement] - offsetRatio[tickPlacement]);

        lastItem.labelOffset = labelOffset;
      }
    }
  }

  return allTickItems;
}
