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
  const hasCustomStyling =
    tickLabelStyle?.fontSize !== undefined ||
    (tickLabelStyle?.angle !== undefined && Math.abs(tickLabelStyle.angle) > 0);
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

      // Fast-path for short text without measurement
      if (!needsPreciseMeasurement && formattedValue.length <= 4) {
        shortenedLabels.set(item, formattedValue);
        continue;
      }

      // That maximum width of the tick depends on its proximity to the axis bounds.
      const width = Math.min(
        (item.offset + item.labelOffset) * leftBoundFactor,
        (drawingArea.left +
          drawingArea.width +
          drawingArea.right -
          item.offset -
          item.labelOffset) *
          rightBoundFactor,
      );

      const doesTextFit = (text: string) =>
        doesTextFitInRect(text, {
          width,
          height: maxHeight,
          angle,
          measureText: (string: string) => getStringSize(string, tickLabelStyle),
        });

      const shortened = ellipsize(formattedValue, doesTextFit);

      // For custom styling with short labels, prefer full text over ellipsization if result is too short
      if (
        hasCustomStyling &&
        formattedValue.length <= 12 &&
        (shortened === '' || shortened.length < formattedValue.length * 0.7)
      ) {
        shortenedLabels.set(item, formattedValue);
      } else {
        shortenedLabels.set(item, shortened);
      }
    }
  }

  return shortenedLabels;
}
