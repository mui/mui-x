'use client';
import * as React from 'react';
import { useChartContext } from '../context/ChartProvider';
import { AxisConfig, D3Scale } from '../models/axis';
import { isBandScale } from '../internals/isBandScale';
import { isInfinity } from '../internals/isInfinity';
import type { TickItemType, TickParams } from './useTicks';

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
    scale: D3Scale;
    valueFormatter?: AxisConfig['valueFormatter'];
    direction: 'x' | 'y';
    getGrouping: AxisConfig['getGrouping'];
  } & Pick<TickParams, 'tickNumber' | 'tickInterval' | 'tickPlacement' | 'tickLabelPlacement'>,
): GroupedTickItemType[] {
  const { scale, tickNumber, tickInterval, direction, getGrouping } = options;
  const { instance } = useChartContext();

  return React.useMemo(() => {
    // band scale
    if (isBandScale(scale)) {
      const domain = scale.domain();

      if (scale.bandwidth() > 0) {
        // scale type = 'band'
        const filteredDomain =
          (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
          (typeof tickInterval === 'object' && tickInterval) ||
          domain;
        const entries = mapToGrouping(filteredDomain, getGrouping, scale);

        if (entries.find((v) => v.offset === scale.range()[1])) {
          // If the last tick is already at the end of the scale, we don't need to add a new one
          return entries;
        }

        return [
          ...entries,

          // Last tick
          {
            formattedValue: undefined,
            offset: scale.range()[1],
            labelOffset: 0,
          },
        ];
      }

      // scale type = 'point'
      const filteredDomain =
        (typeof tickInterval === 'function' && domain.filter(tickInterval)) ||
        (typeof tickInterval === 'object' && tickInterval) ||
        domain;

      return mapToGrouping(filteredDomain, getGrouping, scale);
    }

    const domain = scale.domain();
    // Skip axis rendering if no data is available
    // - The domains contains Infinity for continuous scales.
    if (domain.some(isInfinity)) {
      return [];
    }
    const ticks = typeof tickInterval === 'object' ? tickInterval : scale.ticks(tickNumber);

    // Ticks inside the drawing area
    const visibleTicks: TickItemType[] = [];

    for (let i = 0; i < ticks.length; i += 1) {
      const value = ticks[i];
      const offset = scale(value);
      const isInside = direction === 'x' ? instance.isXInside(offset) : instance.isYInside(offset);

      if (isInside) {
        visibleTicks.push(value);
      }
    }

    return mapToGrouping(visibleTicks, getGrouping, scale);
  }, [scale, tickInterval, tickNumber, direction, instance, getGrouping]);
}

function mapToGrouping(tickValues: any[], getGrouping: AxisConfig['getGrouping'], scale: D3Scale) {
  let syncIndex = -1;
  return tickValues
    .flatMap((value, i) => {
      // We only run ChartsGroupedXAxis if getGrouping is defined
      return (getGrouping as Exclude<AxisConfig['getGrouping'], undefined>)(value, i).map(
        (groupValue, groupIndex) => ({
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
        }),
      );
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
        if (isBandScale(scale)) {
          const count = arr.filter((v) => v.syncIndex === item.syncIndex).length;
          const labelOffset = scale.step() * count * (offsetRatio.middle - offsetRatio.extremities);
          const lastIndex = acc.findLastIndex((v) => v.dataIndex === item.dataIndex);
          if (lastIndex > -1) {
            acc[lastIndex].ignoreTick = true;
          }
          item.labelOffset = labelOffset;
          acc.push(item);
        } else {
          const lastIndex = acc.findIndex((v) => v.dataIndex === item.dataIndex);
          if (lastIndex === -1) {
            acc.push(item);
          } else {
            acc[lastIndex] = item;
          }
        }
      }
      return acc;
    }, [] as GroupedTickItemType[]);
}
