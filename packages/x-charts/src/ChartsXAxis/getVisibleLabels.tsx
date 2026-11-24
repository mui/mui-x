'use client';
import type { TickItem } from '../hooks/useTicks';
import type { GroupedTickItemType } from '../hooks/useTicksGrouped';
import type { AxisGroup, ChartsXAxisProps, ComputedXAxis } from '../models/axis';
import { getMinXTranslation } from '../internals/geometry';
import type { ChartsTextStyle } from '../internals/getWordsByLines';
import { batchMeasureStrings } from '../internals/domUtils';

/* Returns a set of indices of the tick labels that should be visible.  */
export function getVisibleLabels<T extends TickItem>(
  xTicks: T[],
  {
    tickLabelStyle: style,
    tickLabelInterval,
    tickLabelMinGap,
    reverse,
    isMounted,
    isXInside,
  }: Pick<ChartsXAxisProps, 'tickLabelInterval' | 'tickLabelStyle'> &
    Pick<ComputedXAxis, 'reverse'> & {
      isMounted: boolean;
      tickLabelMinGap: NonNullable<ChartsXAxisProps['tickLabelMinGap']>;
      isXInside: (x: number) => boolean;
    },
): Set<T> {
  if (typeof tickLabelInterval === 'function') {
    return new Set(xTicks.filter((item, index) => tickLabelInterval(item.value, index)));
  }

  // Filter label to avoid overlap
  let previousTextLimit = 0;
  const direction = reverse ? -1 : 1;

  const candidateTickLabels = xTicks.filter((item) => {
    const { offset, labelOffset, formattedValue } = item;

    if (formattedValue === '') {
      return false;
    }

    const textPosition = offset + labelOffset;

    return isXInside(textPosition);
  });

  const sizeMap = measureTickLabels(candidateTickLabels, style);

  return new Set(
    candidateTickLabels.filter((item, labelIndex) => {
      const { offset, labelOffset } = item;

      const textPosition = offset + labelOffset;

      if (
        labelIndex > 0 &&
        direction * textPosition < direction * previousTextLimit + tickLabelMinGap
      ) {
        return false;
      }

      const { width, height } = isMounted
        ? getTickLabelSize(sizeMap, item)
        : { width: 0, height: 0 };

      const distance = getMinXTranslation(width, height, style?.angle);

      const currentTextLimit = textPosition - (direction * distance) / 2;
      if (
        labelIndex > 0 &&
        direction * currentTextLimit < direction * previousTextLimit + tickLabelMinGap
      ) {
        // Except for the first label, we skip all label that overlap with the last accepted.
        // Notice that the early return prevents `previousTextLimit` from being updated.
        return false;
      }

      previousTextLimit = textPosition + (direction * distance) / 2;
      return true;
    }),
  );
}

/**
 * Returns the visible tick labels of a grouped axis. Overlap is resolved per group level.
 * With `'auto'`, a level that has a parent level shows all its labels, or the middle label of each
 * parent group, or none, whichever is the first to fit. The outermost level hides overlapping labels.
 */
export function getVisibleGroupedLabels(
  ticks: GroupedTickItemType[],
  groups: AxisGroup[],
  { tickLabelStyle, tickLabelInterval, ...options }: Parameters<typeof getVisibleLabels>[1],
): Set<GroupedTickItemType> {
  const visibleLabels = new Set<GroupedTickItemType>();
  const getLevelTicks = (groupIndex: number) =>
    ticks.filter((tick) => tick.groupIndex === groupIndex && tick.formattedValue !== undefined);

  groups.forEach((group, groupIndex) => {
    const levelTicks = getLevelTicks(groupIndex);
    const parentTicks = getLevelTicks(groupIndex + 1);
    const levelOptions = {
      ...options,
      tickLabelInterval,
      tickLabelStyle: { ...tickLabelStyle, ...group.tickLabelStyle },
    };

    if (typeof tickLabelInterval === 'function' || parentTicks.length === 0) {
      getVisibleLabels(levelTicks, levelOptions).forEach((tick) => visibleLabels.add(tick));
      return;
    }

    const onScreenTicks = levelTicks.filter((tick) =>
      options.isXInside(tick.offset + tick.labelOffset),
    );
    const candidates = [levelTicks, getMiddleTicks(onScreenTicks, parentTicks)];
    for (const candidate of candidates) {
      const visible = getVisibleLabels(candidate, levelOptions);
      const fits = candidate.every(
        (tick) =>
          visible.has(tick) ||
          tick.formattedValue === '' ||
          !options.isXInside(tick.offset + tick.labelOffset),
      );

      if (fits) {
        visible.forEach((tick) => visibleLabels.add(tick));
        return;
      }
    }
  });

  return visibleLabels;
}

/* Returns the middle tick of each parent group. Both lists are sorted by `dataIndex`. */
function getMiddleTicks(levelTicks: GroupedTickItemType[], parentTicks: GroupedTickItemType[]) {
  const middleTicks: GroupedTickItemType[] = [];
  let childIndex = 0;

  parentTicks.forEach((parent, parentIndex) => {
    const end = parentTicks[parentIndex + 1]?.dataIndex ?? Infinity;
    const firstChildIndex = childIndex;

    while (childIndex < levelTicks.length && (levelTicks[childIndex].dataIndex ?? 0) < end) {
      childIndex += 1;
    }

    if (childIndex > firstChildIndex) {
      middleTicks.push(
        levelTicks[firstChildIndex + Math.floor((childIndex - firstChildIndex - 1) / 2)],
      );
    }
  });

  return middleTicks;
}

function getTickLabelSize<T extends TickItem>(
  sizeMap: Map<string | number, { width: number; height: number }>,
  tick: T,
) {
  if (tick.formattedValue === undefined) {
    return { width: 0, height: 0 };
  }

  let width = 0;
  let height = 0;

  for (const line of tick.formattedValue.split('\n')) {
    const lineSize = sizeMap.get(line);
    if (lineSize) {
      width = Math.max(width, lineSize.width);
      height += lineSize.height;
    }
  }

  return { width, height };
}

function measureTickLabels<T extends TickItem>(ticks: T[], style: ChartsTextStyle | undefined) {
  const strings = new Set<string>();

  for (const tick of ticks) {
    if (tick.formattedValue) {
      tick.formattedValue.split('\n').forEach((line) => strings.add(line));
    }
  }

  return batchMeasureStrings(strings, style);
}
