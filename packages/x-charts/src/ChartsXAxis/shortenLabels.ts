import { clampAngle } from '../internals/clampAngle';
import { doesTextFitInRect, ellipsize } from '../internals/ellipsize';
import { getStringSize } from '../internals/domUtils';
import { TickItemType } from '../hooks/useTicks';
import { ChartsXAxisProps } from '../models/axis';
import { ChartDrawingArea } from '../hooks/useDrawingArea';

export function shortenLabels(
  visibleLabels: Set<TickItemType>,
  drawingArea: Pick<ChartDrawingArea, 'left' | 'width' | 'right'>,
  maxHeight: number,
  isRtl: boolean,
  tickLabelStyle: ChartsXAxisProps['tickLabelStyle'],
) {
  const shortenedLabels = new Map<TickItemType, string>();
  const angle = clampAngle(tickLabelStyle?.angle ?? 0);

  // Detect if we need expensive text measurement
  const hasCustomStyling = tickLabelStyle?.fontSize !== undefined || angle > 0;
  const MEASUREMENT_THRESHOLD = 12;
  const needsPreciseMeasurement = hasCustomStyling || visibleLabels.size > MEASUREMENT_THRESHOLD;

  // Multiplying the space available to the left of the text position by leftBoundFactor returns the max width of the text.
  // Same for rightBoundFactor
  let leftBoundFactor = 1;
  let rightBoundFactor = 1;

  if (tickLabelStyle?.textAnchor === 'start') {
    leftBoundFactor = Infinity;
    rightBoundFactor = 1;
  } else if (tickLabelStyle?.textAnchor === 'end') {
    leftBoundFactor = 1;
    rightBoundFactor = Infinity;
  } else {
    leftBoundFactor = 2;
    rightBoundFactor = 2;
  }

  if (angle > 90 && angle < 270) {
    [leftBoundFactor, rightBoundFactor] = [rightBoundFactor, leftBoundFactor];
  }

  if (isRtl) {
    [leftBoundFactor, rightBoundFactor] = [rightBoundFactor, leftBoundFactor];
  }

  for (const item of visibleLabels) {
    if (item.formattedValue) {
      const formattedValue = item.formattedValue.toString();

      // Fast path for short text with default styling
      const REASONABLE_TEXT_LENGTH = 20;
      if (!needsPreciseMeasurement && formattedValue.length <= REASONABLE_TEXT_LENGTH) {
        shortenedLabels.set(item, formattedValue);
        continue;
      }

      // Calculate available width for complex cases
      let width = Math.min(
        (item.offset + item.labelOffset) * leftBoundFactor,
        (drawingArea.left +
          drawingArea.width +
          drawingArea.right -
          item.offset -
          item.labelOffset) *
          rightBoundFactor,
      );

      // Adjust width calculations for custom styling to prevent label disappearing
      if (hasCustomStyling) {
        if (angle > 0 && angle < 180) {
          const angleMultiplier = 2.0 + (angle / 90) * 2.0;
          width *= angleMultiplier;
        }
        width = Math.max(width, 120);
      } else {
        width = Math.max(width, 30);
      }

      const doesTextFit = (text: string) => {
        if (!text || text.length === 0) {
          return true;
        }

        return doesTextFitInRect(text, {
          width,
          height: maxHeight,
          angle,
          measureText: (string: string) => getStringSize(string, tickLabelStyle),
        });
      };

      if (doesTextFit(formattedValue)) {
        shortenedLabels.set(item, formattedValue);
      } else {
        const ellipsizedText = ellipsize(formattedValue, doesTextFit);
        shortenedLabels.set(
          item,
          ellipsizedText && ellipsizedText.length >= 3 ? ellipsizedText : formattedValue,
        );
      }
    }
  }

  return shortenedLabels;
}
