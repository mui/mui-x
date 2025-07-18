'use client';
import { clampAngle } from '../internals/clampAngle';
import { doesTextFitInRect, ellipsize } from '../internals/ellipsize';
import { getStringSize } from '../internals/domUtils';
import { ChartDrawingArea } from '../hooks/useDrawingArea';
import { TickItemType } from '../hooks/useTicks';
import { ChartsYAxisProps } from '../models/axis';

export function shortenLabels(
  visibleLabels: TickItemType[],
  drawingArea: Pick<ChartDrawingArea, 'top' | 'height' | 'bottom'>,
  maxWidth: number,
  isRtl: boolean,
  tickLabelStyle: ChartsYAxisProps['tickLabelStyle'],
) {
  const shortenedLabels = new Map<TickItemType, string>();
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

  // Detect if we need expensive text measurement
  const hasCustomStyling = tickLabelStyle?.fontSize !== undefined || angle > 0;
  const MEASUREMENT_THRESHOLD = 12;
  const needsPreciseMeasurement = hasCustomStyling || visibleLabels.length > MEASUREMENT_THRESHOLD;

  for (const item of visibleLabels) {
    if (item.formattedValue) {
      const formattedValue = item.formattedValue.toString();

      // Fast path for short text with default styling
      const REASONABLE_TEXT_LENGTH = 20;
      if (!needsPreciseMeasurement && formattedValue.length <= REASONABLE_TEXT_LENGTH) {
        shortenedLabels.set(item, formattedValue);
        continue;
      }

      // That maximum height of the tick depends on its proximity to the axis bounds.
      let height = Math.min(
        (item.offset + item.labelOffset) * topBoundFactor,
        (drawingArea.top +
          drawingArea.height +
          drawingArea.bottom -
          item.offset -
          item.labelOffset) *
        bottomBoundFactor,
      );

      // Adjust height calculations for custom styling to prevent label disappearing  
      if (hasCustomStyling) {
        if (angle > 0 && angle < 180) {
          const angleMultiplier = 1.5 + (angle / 180) * 1.2;
          height *= angleMultiplier;
        }
        height = Math.max(height, 50);
      } else {
        height = Math.max(height, 20);
      }

      const doesTextFit = (text: string) => {
        if (!text || text.length === 0) {
          return true;
        }

        return doesTextFitInRect(text, {
          width: maxWidth,
          height,
          angle,
          measureText: (string: string) => getStringSize(string, tickLabelStyle),
        });
      };

      if (doesTextFit(formattedValue)) {
        shortenedLabels.set(item, formattedValue);
      } else {
        const ellipsizedText = ellipsize(formattedValue, doesTextFit);
        shortenedLabels.set(item, ellipsizedText && ellipsizedText.length >= 3 ? ellipsizedText : formattedValue);
      }
    }
  }

  return shortenedLabels;
}
