'use client';
import { TickItemType } from '../hooks/useTicks';
import { ChartsXAxisProps, ComputedXAxis } from '../models/axis';
import { getMinXTranslation } from '../internals/geometry';
import { getWordsByLines } from '../internals/getWordsByLines';

/* Returns a set of indices of the tick labels that should be visible.  */
export function getVisibleLabels<T extends TickItemType>(
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
  const getTickLabelSize = (tick: T) => {
    if (!isMounted || tick.formattedValue === undefined) {
      return { width: 0, height: 0 };
    }

    const tickSizes = getWordsByLines({ style, needsComputation: true, text: tick.formattedValue });

    return {
      width: Math.max(...tickSizes.map((size) => size.width)),
      height: Math.max(tickSizes.length * tickSizes[0].height),
    };
  };

  if (typeof tickLabelInterval === 'function') {
    return new Set(xTicks.filter((item, index) => tickLabelInterval(item.value, index)));
  }

  // Filter label to avoid overlap
  let previousTextLimit = 0;
  const direction = reverse ? -1 : 1;

  return new Set(
    xTicks.filter((item, labelIndex) => {
      const { offset, labelOffset } = item;
      const textPosition = offset + labelOffset;

      if (
        labelIndex > 0 &&
        direction * textPosition < direction * (previousTextLimit + tickLabelMinGap)
      ) {
        return false;
      }

      if (!isXInside(textPosition)) {
        return false;
      }

      /* Measuring text width is expensive, so we need to delay it as much as possible to improve performance. */
      const { width, height } = getTickLabelSize(item);

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
