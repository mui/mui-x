import type { DefaultedXAxis, DefaultedYAxis, AxisGroup } from '../../../../models/axis';
import { batchMeasureStrings } from '../../../domUtils';
import type { ChartsTextStyle } from '../../../getWordsByLines';
import { getMinXTranslation } from '../../../geometry';
import { deg2rad } from '../../../angleConversion';
import {
  AXIS_AUTO_SIZE_PADDING,
  AXIS_AUTO_SIZE_MIN,
  AXIS_AUTO_SIZE_TICK_SIZE,
  AXIS_AUTO_SIZE_TICK_LABEL_GAP,
  AXIS_LABEL_DEFAULT_HEIGHT,
} from '../../../../constants';

/**
 * Checks if an axis has groups defined.
 */
function hasGroups(
  axis: DefaultedXAxis | DefaultedYAxis,
): axis is DefaultedXAxis & { groups: AxisGroup[] } {
  return 'groups' in axis && Array.isArray(axis.groups) && axis.groups.length > 0;
}

/**
 * Calculates the tick size for a specific group level.
 * This mirrors the logic in ChartsGroupedXAxisTicks/ChartsGroupedYAxisTicks.
 * If the group has a custom tickSize, use it. Otherwise, calculate based on the formula.
 */
function getGroupTickSize(group: AxisGroup, groupIndex: number, baseTickSize: number): number {
  if (group.tickSize !== undefined) {
    return group.tickSize;
  }
  return baseTickSize * groupIndex * 2 + baseTickSize;
}

/**
 * Gets the unique labels for a specific group level.
 */
function getGroupLabels(data: readonly any[], group: AxisGroup): string[] {
  const uniqueLabels = new Set<string>();

  for (let dataIndex = 0; dataIndex < data.length; dataIndex += 1) {
    const value = data[dataIndex];
    const groupValue = group.getValue(value, dataIndex);
    uniqueLabels.add(`${groupValue}`);
  }

  return Array.from(uniqueLabels);
}

interface ComputeAxisAutoSizeOptions {
  axis: DefaultedXAxis | DefaultedYAxis;
  direction: 'x' | 'y';
  isHydrated: boolean;
  /**
   * For continuous scales, the computed extrema from series data.
   * This is used to estimate tick labels more accurately.
   */
  extrema?: [number, number];
}

/**
 * Gets tick labels that would be displayed for the axis.
 * For ordinal scales (band/point), use axis.data.
 * For continuous scales, generate estimated tick values from min/max or provided extrema.
 */
function getTickLabels(
  axis: DefaultedXAxis | DefaultedYAxis,
  extrema?: [number, number],
): string[] {
  const { valueFormatter, scaleType, data, min, max } = axis as DefaultedXAxis &
    DefaultedYAxis & { min?: number; max?: number };

  // For ordinal scales, use axis.data
  if (scaleType === 'band' || scaleType === 'point') {
    if (!data || data.length === 0) {
      return [];
    }
    return data.map((value) => {
      if (valueFormatter) {
        // For auto-size computation, we use 'tick' location context
        // We pass a minimal context since we don't have the actual scale yet
        return valueFormatter(value, {
          location: 'tick',
          scale: {} as any,
          defaultTickLabel: `${value}`,
          tickNumber: data.length,
        });
      }
      return `${value}`;
    });
  }

  // For continuous scales, estimate tick values from domain
  // Use provided extrema if available, otherwise fall back to axis min/max or defaults
  let minVal: number;
  let maxVal: number;

  if (extrema && extrema[0] !== Infinity && extrema[1] !== -Infinity) {
    // Use computed extrema from series data, but respect user-provided min/max overrides
    minVal = min ?? extrema[0];
    maxVal = max ?? extrema[1];
  } else {
    // Fall back to user-provided min/max or defaults
    minVal = min ?? 0;
    maxVal = max ?? 100;
  }

  if (minVal === maxVal) {
    const label = valueFormatter
      ? valueFormatter(minVal, {
          location: 'tick',
          scale: {} as any,
          defaultTickLabel: `${minVal}`,
          tickNumber: 1,
        })
      : `${minVal}`;
    return [label];
  }

  // Generate estimated tick values (similar to d3's nice ticks)
  const tickCount = 5;
  const step = (maxVal - minVal) / (tickCount - 1);
  const tickValues: number[] = [];

  for (let i = 0; i < tickCount; i += 1) {
    tickValues.push(minVal + step * i);
  }

  return tickValues.map((value) => {
    if (valueFormatter) {
      return valueFormatter(value, {
        location: 'tick',
        scale: {} as any,
        defaultTickLabel: `${value}`,
        tickNumber: tickCount,
      });
    }
    // Format numbers reasonably
    if (Number.isInteger(value)) {
      return `${value}`;
    }
    return value.toFixed(2);
  });
}

/**
 * Measures all lines of text from tick labels and returns the maximum dimensions.
 */
function measureTickLabels(
  labels: string[],
  style: ChartsTextStyle | undefined,
): { maxWidth: number; maxHeight: number } {
  if (labels.length === 0) {
    return { maxWidth: 0, maxHeight: 0 };
  }

  // Split labels by newlines and collect all unique lines
  const allLines = new Set<string>();
  for (const label of labels) {
    const lines = label.split('\n');
    for (const line of lines) {
      allLines.add(line);
    }
  }

  // Batch measure all lines
  const sizeMap = batchMeasureStrings(allLines, style);

  // Find max dimensions across all labels (considering multi-line)
  let maxWidth = 0;
  let maxHeight = 0;

  for (const label of labels) {
    const lines = label.split('\n');
    let labelWidth = 0;
    let labelHeight = 0;

    for (const line of lines) {
      const size = sizeMap.get(line) ?? { width: 0, height: 0 };
      labelWidth = Math.max(labelWidth, size.width);
      labelHeight += size.height;
    }

    maxWidth = Math.max(maxWidth, labelWidth);
    maxHeight = Math.max(maxHeight, labelHeight);
  }

  return { maxWidth, maxHeight };
}

/**
 * Computes the bounding box dimension when a rectangle is rotated.
 * For x-axis, we need the height of the rotated bounding box.
 * For y-axis, we need the width of the rotated bounding box.
 */
function getRotatedDimension(
  width: number,
  height: number,
  angle: number | undefined,
  direction: 'x' | 'y',
): number {
  if (angle === undefined || angle === 0) {
    return direction === 'x' ? height : width;
  }

  const radAngle = deg2rad(Math.abs(angle));
  const cosAngle = Math.cos(radAngle);
  const sinAngle = Math.sin(radAngle);

  if (direction === 'x') {
    // For x-axis, compute rotated bounding box height
    return Math.abs(width * sinAngle) + Math.abs(height * cosAngle);
  }

  // For y-axis, compute rotated bounding box width
  // This is similar to getMinXTranslation for horizontal spacing
  return getMinXTranslation(width, height, angle);
}

/**
 * Computes the auto-size dimension for a grouped axis.
 * For grouped axes, we need to account for multiple group levels, each with its own
 * tick size and label dimensions.
 */
function computeGroupedAxisAutoSize(
  axis: DefaultedXAxis & { groups: AxisGroup[] },
  direction: 'x' | 'y',
): number | undefined {
  const { groups, data, tickSize: baseTickSize, tickLabelStyle: axisTickLabelStyle } = axis;
  const hasAxisLabel = Boolean(axis.label);

  if (!data || data.length === 0) {
    return AXIS_AUTO_SIZE_MIN;
  }

  // Calculate the maximum extent across all group levels
  // Each group level has: tickSize + gap + labelHeight
  // The tick sizes increase with group level, and labels are positioned at tickSize + gap
  let maxExtent = 0;

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
    const group = groups[groupIndex];
    const groupTickSize = getGroupTickSize(
      group,
      groupIndex,
      baseTickSize ?? AXIS_AUTO_SIZE_TICK_SIZE,
    );

    // Get labels for this group level
    const groupLabels = getGroupLabels(data, group);

    if (groupLabels.length === 0) {
      continue;
    }

    // Merge axis tick label style with group-specific style
    const groupTickLabelStyle = {
      ...axisTickLabelStyle,
      ...group.tickLabelStyle,
    } as ChartsTextStyle | undefined;

    const angle = groupTickLabelStyle?.angle;

    // Measure labels for this group
    const { maxWidth, maxHeight } = measureTickLabels(groupLabels, groupTickLabelStyle);

    // Handle SSR case
    if (maxWidth === 0 && maxHeight === 0) {
      return undefined;
    }

    // Get the dimension based on direction and rotation
    const labelDimension = getRotatedDimension(maxWidth, maxHeight, angle, direction);

    // Calculate the extent for this group level
    // Labels are positioned at tickSize + gap, and extend by labelDimension
    const groupExtent = groupTickSize + AXIS_AUTO_SIZE_TICK_LABEL_GAP + labelDimension;

    maxExtent = Math.max(maxExtent, groupExtent);
  }

  // Calculate total axis size
  let totalSize = maxExtent;

  // Add axis label if present
  if (hasAxisLabel) {
    totalSize += AXIS_LABEL_DEFAULT_HEIGHT;
  }

  // Add padding
  totalSize += AXIS_AUTO_SIZE_PADDING;

  // Ensure minimum size
  return Math.max(Math.ceil(totalSize), AXIS_AUTO_SIZE_MIN);
}

/**
 * Computes the auto-size dimension for an axis based on tick label measurements.
 * Returns undefined if measurement is not available (SSR or not hydrated).
 */
export function computeAxisAutoSize(options: ComputeAxisAutoSizeOptions): number | undefined {
  const { axis, direction, isHydrated, extrema } = options;

  // During SSR or before hydration, return undefined to use fallback
  if (!isHydrated) {
    return undefined;
  }

  // Handle grouped axes separately
  if (hasGroups(axis)) {
    return computeGroupedAxisAutoSize(axis, direction);
  }

  const tickLabelStyle = axis.tickLabelStyle as ChartsTextStyle | undefined;
  const tickSize = axis.tickSize ?? AXIS_AUTO_SIZE_TICK_SIZE;
  const hasLabel = Boolean(axis.label);
  const angle = tickLabelStyle?.angle;

  // Get tick labels
  const labels = getTickLabels(axis, extrema);

  if (labels.length === 0) {
    return AXIS_AUTO_SIZE_MIN;
  }

  // Measure tick labels
  const { maxWidth, maxHeight } = measureTickLabels(labels, tickLabelStyle);

  // Handle SSR case where measurement returns 0
  if (maxWidth === 0 && maxHeight === 0) {
    return undefined;
  }

  // Get the dimension based on direction and rotation
  const labelDimension = getRotatedDimension(maxWidth, maxHeight, angle, direction);

  // Calculate total axis size
  let totalSize = 0;

  // Add tick size
  totalSize += tickSize;

  // Add gap between tick and label
  totalSize += AXIS_AUTO_SIZE_TICK_LABEL_GAP;

  // Add label dimension
  totalSize += labelDimension;

  // Add axis label if present
  if (hasLabel) {
    totalSize += AXIS_LABEL_DEFAULT_HEIGHT;
  }

  // Add padding
  totalSize += AXIS_AUTO_SIZE_PADDING;

  // Ensure minimum size
  return Math.max(Math.ceil(totalSize), AXIS_AUTO_SIZE_MIN);
}
