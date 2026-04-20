'use client';
import { clampAngle } from '../internals/clampAngle';
import { doesTextFitInRect, ellipsize } from '../internals/ellipsize';
import { getStringSize } from '../internals/domUtils';
import { type ChartDrawingArea } from '../hooks';
import { type TickItem } from '../hooks/useTicks';
import { type ChartsYAxisProps } from '../models';

export function shortenLabels(
  visibleLabels: TickItem[],
  drawingArea: Pick<ChartDrawingArea, 'top' | 'height' | 'bottom'>,
  maxWidth: number,
  isRtl: boolean,
  tickLabelStyle: ChartsYAxisProps['tickLabelStyle'],
) {
  const shortenedLabels = new Map<TickItem, string>();
  const angle = clampAngle(tickLabelStyle?.angle ?? 0);

  let topBoundFactor = 1;
  let bottomBoundFactor = 1;

  if (tickLabelStyle?.textAnchor === 'start') {
    topBoundFactor = Infinity;
    bottomBoundFactor = 1;
  } else if (tickLabelStyle?.textAnchor === 'end') {
    topBoundFactor = 1;
    bottomBoundFactor = Infinity;
  } else {
    topBoundFactor = 2;
    bottomBoundFactor = 2;
  }

  if (angle > 180) {
    [topBoundFactor, bottomBoundFactor] = [bottomBoundFactor, topBoundFactor];
  }

  if (isRtl) {
    [topBoundFactor, bottomBoundFactor] = [bottomBoundFactor, topBoundFactor];
  }

  for (const item of visibleLabels) {
    if (item.formattedValue) {
      // That maximum height of the tick depends on its proximity to the axis bounds.
      const height = Math.min(
        (item.offset + item.labelOffset) * topBoundFactor,
        (drawingArea.top +
          drawingArea.height +
          drawingArea.bottom -
          item.offset -
          item.labelOffset) *
          bottomBoundFactor,
      );

      const doesTextFit = (text: string) =>
        doesTextFitInRect(text, {
          width: maxWidth,
          height,
          angle,
          measureText: (string: string) => getStringSize(string, tickLabelStyle),
        });

      shortenedLabels.set(item, ellipsize(item.formattedValue.toString(), doesTextFit));
    }
  }

  return shortenedLabels;
}
