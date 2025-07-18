'use client';
import { TickItemType } from '../hooks/useTicks';
import { ChartsXAxisProps, ComputedXAxis } from '../models/axis';

/* Returns a set of tick labels that should be visible. Measuring text width is expensive, 
 * so we use smart heuristics to minimize DOM operations while ensuring labels don't disappear due to styling. */
export function getVisibleLabels(
  xTicks: TickItemType[],
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
): Set<TickItemType> {
  
  if (typeof tickLabelInterval === 'function') {
    return new Set(xTicks.filter((item, index) => tickLabelInterval(item.value, index)));
  }

  const withinBounds = xTicks.filter((item) => {
    const { offset, labelOffset } = item;
    const textPosition = offset + labelOffset;
    return isXInside(textPosition);
  });

  // For custom styling (fontSize, angle), show all labels to prevent disappearing issue
  const hasCustomStyling = style?.fontSize !== undefined || 
                          style?.angle !== undefined || 
                          Math.abs(style?.angle ?? 0) > 0;

  if (!hasCustomStyling && isMounted) {
    return new Set(smartFilterWithoutMeasurement(withinBounds, tickLabelMinGap, reverse));
  }

  return new Set(withinBounds);
}

/* Smart filtering without expensive text measurement for default styling. */
function smartFilterWithoutMeasurement(
  ticks: TickItemType[],
  minGap: number,
  reverse?: boolean
): TickItemType[] {
  if (ticks.length <= 1) {
    return ticks;
  }

  const result: TickItemType[] = [];
  const sortedTicks = reverse ? [...ticks].reverse() : ticks;
  
  const ESTIMATED_LABEL_WIDTH = 45;
  const SPACING_MULTIPLIER = 2;
  const requiredSpacing = Math.max(minGap * SPACING_MULTIPLIER, ESTIMATED_LABEL_WIDTH);
  
  let lastPosition = -Infinity;
  
  for (const tick of sortedTicks) {
    const currentPosition = tick.offset + (tick.labelOffset ?? 0);
    
    if (currentPosition - lastPosition >= requiredSpacing) {
      result.push(tick);
      lastPosition = currentPosition;
    }
  }
  
  return reverse ? result.reverse() : result;
}
