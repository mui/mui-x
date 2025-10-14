'use client';
import { TickItemType } from '../hooks/useTicks';
import { ChartsXAxisProps } from '../models/axis';
import { getMinXTranslation } from '../internals/geometry';
import { ChartsTextStyle } from '../internals/getWordsByLines';
import { batchMeasureStrings } from '../internals/domUtils';

/* Returns a set of indices of the tick labels that should be visible.  */
export function getVisibleLabels<T extends TickItemType>(
  xTicks: T[],
  tickLabelStyle: ChartsXAxisProps['tickLabelStyle'],
  tickLabelMinGap: number,
  reverse: boolean,
  isMounted: boolean,
  isXInside: (x: number) => boolean,
  drawingAreaWidth: number,
): Set<T> {
  // Filter label to avoid overlap
  let previousTextLimit = 0;
  const direction = reverse ? -1 : 1;

  let candidateTickLabels: T[] = [];

  for (const item of xTicks) {
    const { offset, labelOffset, formattedValue } = item;

    if (formattedValue === '') {
      continue;
    }

    const textPosition = offset + labelOffset;

    if (!isXInside(textPosition)) {
      continue;
    }

    candidateTickLabels.push(item);
  }

  // If there are more labels than pixels, we can allocate one label per pixel and skip the rest,
  // saving time on measuring.
  if (candidateTickLabels.length > drawingAreaWidth) {
    const preCandidates: T[] = candidateTickLabels;
    candidateTickLabels = [];

    let lastPixel = -Infinity;
    for (const item of preCandidates) {
      // Round to the nearest pixel to avoid sub-pixel overlap checks
      const roundedLabelPosition = Math.round(item.offset + item.labelOffset);
      if (roundedLabelPosition !== lastPixel) {
        candidateTickLabels.push(item);
        lastPixel = roundedLabelPosition;
      }
    }
  }

  const sizeMap = measureTickLabels(candidateTickLabels, tickLabelStyle);

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

      const distance = getMinXTranslation(width, height, tickLabelStyle?.angle);

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

function getTickLabelSize<T extends TickItemType>(
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

function measureTickLabels<T extends TickItemType>(ticks: T[], style: ChartsTextStyle | undefined) {
  const strings = new Set<string>();

  for (const tick of ticks) {
    if (tick.formattedValue) {
      tick.formattedValue.split('\n').forEach((line) => strings.add(line));
    }
  }

  return batchMeasureStrings(strings, style);
}
