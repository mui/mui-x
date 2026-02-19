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
  AXIS_AUTO_SIZE_GROUP_GAP,
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
  /**
   * The actual data extrema [min, max] for continuous scales.
   * When provided, these are used instead of the axis min/max props to estimate tick labels.
   */
  extrema?: [number, number];
}

/**
 * Result of auto-size computation for grouped axes.
 * Includes both the total size and the computed tick sizes for each group level.
 */
export interface GroupedAxisAutoSizeResult {
  size: number;
  /**
   * Computed tick sizes for each group level.
   * These are cumulative - each group's tick extends further than the previous.
   * The renderer should use these instead of the formula-based tick sizes.
   */
  groupTickSizes: number[];
}

/**
 * Result of auto-size computation.
 * For regular axes, returns just a number.
 * For grouped axes, returns an object with size and group tick sizes.
 */
export type AxisAutoSizeResult = number | GroupedAxisAutoSizeResult;

/**
 * Type guard to check if the result is a grouped axis result.
 */
export function isGroupedAxisAutoSizeResult(
  result: AxisAutoSizeResult | undefined,
): result is GroupedAxisAutoSizeResult {
  return result !== undefined && typeof result === 'object' && 'groupTickSizes' in result;
}

/**
 * The maximum number of labels to measure for band/point scales.
 * We only need the widest label to determine auto-size, so we pick a small set of
 * candidates using label length as a proxy for visual width instead of measuring all.
 */
const MAX_AUTO_SIZE_CANDIDATES = 5;

/**
 * From a list of rendered label strings, returns a small subset of candidates
 * that are most likely to be the visually widest.
 * Uses character count as a proxy for visual width, which works well in practice.
 */
function selectWidestCandidates(labels: string[]): string[] {
  if (labels.length <= MAX_AUTO_SIZE_CANDIDATES) {
    return labels;
  }

  const getMaxLineLength = (label: string): number => {
    if (!label.includes('\n')) {
      return label.length;
    }
    let max = 0;
    for (const line of label.split('\n')) {
      if (line.length > max) {
        max = line.length;
      }
    }
    return max;
  };

  // Single pass: collect labels with the maximum line length
  let maxLength = 0;
  const candidates: string[] = [];

  for (const label of labels) {
    const len = getMaxLineLength(label);
    if (len > maxLength) {
      maxLength = len;
      candidates.length = 0;
      candidates.push(label);
    } else if (len === maxLength && candidates.length < MAX_AUTO_SIZE_CANDIDATES) {
      candidates.push(label);
    }
  }

  return candidates;
}

/**
 * Gets tick labels that would be displayed for the axis.
 * For ordinal scales (band/point), use axis.data.
 * For continuous scales, generate estimated tick values from axis min/max configuration.
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

    // Map all values to their rendered label strings
    const labels = data.map((value) => {
      if (valueFormatter) {
        return valueFormatter(value, {
          location: 'auto-size',
        });
      }
      return `${value}`;
    });

    // We only need the widest label to determine axis size.
    // Measuring all labels is O(n) DOM operations — instead, pick a small set of
    // candidates using label length as a proxy for visual width.
    return selectWidestCandidates(labels);
  }

  // For continuous scales, we measure the min and max values to estimate axis size.
  // Use axis min/max props first, then data extrema, then defaults.
  const minVal = min ?? (extrema && Number.isFinite(extrema[0]) ? extrema[0] : 0);
  const maxVal = max ?? (extrema && Number.isFinite(extrema[1]) ? extrema[1] : 100);

  // Measure both min and max values to find the widest label
  const valuesToMeasure = minVal === maxVal ? [minVal] : [minVal, maxVal];

  return valuesToMeasure.map((value) => {
    if (valueFormatter) {
      return valueFormatter(value, {
        location: 'auto-size',
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
 * For grouped axes, we compute cumulative tick sizes so that each group's labels
 * are positioned after the previous group's labels (no overlap).
 *
 * Returns both the total size and the computed tick sizes for each group level.
 */
function computeGroupedAxisAutoSize(
  axis: DefaultedXAxis & { groups: AxisGroup[] },
  direction: 'x' | 'y',
): GroupedAxisAutoSizeResult | undefined {
  const { groups, data, tickSize: baseTickSize, tickLabelStyle: axisTickLabelStyle } = axis;
  const hasAxisLabel = Boolean(axis.label);

  if (!data || data.length === 0) {
    return { size: AXIS_AUTO_SIZE_MIN, groupTickSizes: [] };
  }

  // Compute cumulative tick sizes for each group level
  // Each group's labels should start after the previous group's labels end
  const groupTickSizes: number[] = [];
  const labelDimensions: number[] = [];
  const defaultTickSize = baseTickSize ?? AXIS_AUTO_SIZE_TICK_SIZE;

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
    const group = groups[groupIndex];

    // Get labels for this group level
    const groupLabels = getGroupLabels(data, group);

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
    labelDimensions.push(labelDimension);

    // If group has custom tickSize, use it directly (user-specified)
    // Otherwise, compute cumulative position after previous group's labels
    const customTickSize = group.tickSize;
    if (customTickSize !== undefined) {
      // User specified an exact tick size - use it directly
      groupTickSizes.push(customTickSize);
    } else if (groupIndex === 0) {
      // First group without custom tickSize - use base
      groupTickSizes.push(defaultTickSize);
    } else {
      // Subsequent group without custom tickSize - position after previous group's labels
      const previousExtent =
        groupTickSizes[groupIndex - 1] +
        AXIS_AUTO_SIZE_TICK_LABEL_GAP +
        labelDimensions[groupIndex - 1] +
        AXIS_AUTO_SIZE_GROUP_GAP;

      groupTickSizes.push(previousExtent + defaultTickSize);
    }
  }

  // Calculate total extent: last group's tickSize + gap + last group's labelDimension
  const lastGroupIndex = groups.length - 1;
  let totalExtent =
    groupTickSizes[lastGroupIndex] +
    AXIS_AUTO_SIZE_TICK_LABEL_GAP +
    labelDimensions[lastGroupIndex];

  // Add axis label if present
  if (hasAxisLabel) {
    totalExtent += AXIS_LABEL_DEFAULT_HEIGHT;
  }

  // Add padding
  totalExtent += AXIS_AUTO_SIZE_PADDING;

  // Ensure minimum size
  const size = Math.max(Math.ceil(totalExtent), AXIS_AUTO_SIZE_MIN);

  return { size, groupTickSizes };
}

/**
 * Computes the auto-size dimension for an axis based on tick label measurements.
 * Returns undefined if measurement is not available (SSR or not hydrated).
 *
 * For regular axes, returns just a number (the size).
 * For grouped axes, returns an object with size and computed group tick sizes.
 */
export function computeAxisAutoSize(
  options: ComputeAxisAutoSizeOptions,
): AxisAutoSizeResult | undefined {
  const { axis, direction, extrema } = options;

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
