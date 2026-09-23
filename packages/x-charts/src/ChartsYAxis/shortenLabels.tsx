'use client';
import { clampAngle } from '../internals/clampAngle';
import { ellipsize, getRotatedTextBounds } from '../internals/ellipsize';
import { getStringSize } from '../internals/domUtils';
import type { ChartDrawingArea } from '../hooks';
import type { TickItem } from '../hooks/useTicks';
import type { ChartsYAxisProps } from '../models';

export function shortenLabels(
  visibleLabels: TickItem[],
  drawingArea: Pick<ChartDrawingArea, 'top' | 'height' | 'bottom'>,
  maxWidth: number,
  isRtl: boolean,
  tickLabelStyle: ChartsYAxisProps['tickLabelStyle'],
) {
  const shortenedLabels = new Map<TickItem, string>();
  const angle = clampAngle(tickLabelStyle?.angle ?? 0);
  const boundsConfig = {
    angle,
    textAnchor: tickLabelStyle?.textAnchor,
    dominantBaseline: tickLabelStyle?.dominantBaseline,
    isRtl,
  };
  const svgHeight = drawingArea.top + drawingArea.height + drawingArea.bottom;

  for (const item of visibleLabels) {
    if (item.formattedValue) {
      // The label is anchored on the tick, so how far it can extend vertically depends on the
      // proximity of the tick to the SVG bounds.
      const anchor = item.offset + item.labelOffset;
      const spaceAbove = anchor;
      const spaceBelow = svgHeight - anchor;

      const doesTextFit = (text: string) => {
        const bounds = getRotatedTextBounds(getStringSize(text, tickLabelStyle), boundsConfig);

        return bounds.width <= maxWidth && bounds.above <= spaceAbove && bounds.below <= spaceBelow;
      };

      shortenedLabels.set(item, ellipsize(item.formattedValue.toString(), doesTextFit));
    }
  }

  return shortenedLabels;
}
