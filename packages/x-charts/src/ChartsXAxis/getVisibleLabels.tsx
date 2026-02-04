'use client';
import { type TickItem } from '../hooks/useTicks';
import { type ChartsXAxisProps, type ComputedXAxis } from '../models/axis';
import { getMinXTranslation } from '../internals/geometry';
import { type ChartsTextStyle } from '../internals/getWordsByLines';
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
        direction * textPosition < direction * (previousTextLimit + tickLabelMinGap)
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
        direction * currentTextLimit < direction * (previousTextLimit + tickLabelMinGap)
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
