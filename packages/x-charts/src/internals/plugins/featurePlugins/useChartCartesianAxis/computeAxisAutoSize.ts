import type {
  DefaultedXAxis,
  DefaultedYAxis,
  AxisGroup,
  ContinuousScaleName,
} from '../../../../models/axis';
import { batchMeasureStrings } from '../../../domUtils';
import type { ChartsTextStyle } from '../../../getWordsByLines';
import { deg2rad } from '../../../angleConversion';
import { getGraphemeCount } from '../../../getGraphemeCount';
import { getScale } from '../../../getScale';
import { scaleBand, scalePoint } from '../../../scales';
import { AXIS_LABEL_DEFAULT_HEIGHT } from '../../../../constants';
import {
  AXIS_AUTO_SIZE_PADDING,
  AXIS_AUTO_SIZE_MIN,
  AXIS_AUTO_SIZE_TICK_SIZE,
  AXIS_AUTO_SIZE_TICK_LABEL_GAP,
  AXIS_AUTO_SIZE_GROUP_GAP,
} from './autoSizeConstants';
import { type DomainDefinition } from './domain';

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
   * The niced domain and tick number for the axis.
   * These reflect the actual displayed domain (after domainLimit processing),
   * so tick labels measured from them match what the chart renders.
   */
  domain?: DomainDefinition;
}

/**
 * Result of auto-size computation for axes.
 */
export interface AxisAutoSizeResult {
  size: number;
  /**
   * Computed tick sizes for each group level.
   * These are cumulative - each group's tick extends further than the previous.
   * The renderer should use these instead of the formula-based tick sizes.
   */
  groupTickSizes?: number[];
}

/**
 * The maximum number of labels to measure for band/point scales.
 * We only need the widest and tallest labels to determine auto-size, so we pick a small set of
 * candidates using grapheme count as a proxy for visual width instead of measuring all.
 */
const MAX_AUTO_SIZE_CANDIDATES = 5;

/**
 * Returns the maximum grapheme count of a label's lines (splitting by newlines).
 * Uses grapheme count instead of string length for correct handling of emojis and complex characters.
 */
function maxLineLength(label: string): number {
  const lines = label.split('\n');
  return Math.max(...lines.map((line) => getGraphemeCount(line)));
}

/**
 * From a list of rendered label strings, returns a small subset of candidates
 * that are most likely to be the visually widest and highest labels to measure for auto-size calculation.
 * Uses character count as a proxy for visual width, and number of lines as a proxy for visual height, which works well in practice.
 *
 * Maintains a sorted list of the top candidates by width, plus the label with the most lines.
 */
function selectLargestCandidates(labels: string[]): string[] {
  if (labels.length <= MAX_AUTO_SIZE_CANDIDATES) {
    return labels;
  }

  const candidates: { label: string; length: number }[] = [];
  let maxLines = 1;
  let maxLinesValue: string | null = null;

  for (const label of labels) {
    const lines = label.split('\n').length;
    if (lines > maxLines) {
      maxLines = lines;
      maxLinesValue = label;
    }

    const length = maxLineLength(label);

    // Keep a sorted array with the largest labels found
    if (candidates.length < MAX_AUTO_SIZE_CANDIDATES || length > candidates[0].length) {
      const index = candidates.findIndex((candidate) => candidate.length > length);
      candidates.splice(index === -1 ? candidates.length : index, 0, { label, length });
      if (candidates.length > MAX_AUTO_SIZE_CANDIDATES) {
        candidates.shift();
      }
    }
  }

  // Add the item with the largest number of lines
  if (
    maxLinesValue !== null &&
    candidates.find((candidate) => candidate.label === maxLinesValue) === undefined
  ) {
    candidates.push({ label: maxLinesValue, length: maxLineLength(maxLinesValue) });
  }

  return candidates.map((candidate) => candidate.label);
}

/**
 * Gets tick labels that would be displayed for the axis.
 * For ordinal scales (band/point), use axis.data.
 * For continuous scales, generate estimated tick values from axis min/max configuration.
 */
function getTickLabels(axis: DefaultedXAxis | DefaultedYAxis, domain?: DomainDefinition): string[] {
  const { valueFormatter, scaleType, data } = axis as DefaultedXAxis & DefaultedYAxis;

  if (scaleType === 'band' || scaleType === 'point') {
    if (!data || data.length === 0) {
      return [];
    }

    const scale = scaleType === 'band' ? scaleBand(data, [0, 1]) : scalePoint(data, [0, 1]);

    const labels = data.map((value) => {
      if (valueFormatter) {
        return valueFormatter(value, {
          location: 'tick',
          scale,
          defaultTickLabel: `${value}`,
        });
      }
      return `${value}`;
    });

    return selectLargestCandidates(labels);
  }

  // Use niced domain values (already processed through domainLimit), or defaults.
  const minVal = domain ? domain.domain[0] : 0;
  const maxVal = domain ? domain.domain[1] : 100;
  const tickNumber = domain?.tickNumber ?? 2;

  // Create a temporary scale for formatting (tickFormat only uses the domain, not the range)
  const continuousScaleType = (scaleType ?? 'linear') as ContinuousScaleName;
  const scale = getScale(continuousScaleType, [minVal, maxVal] as any, [0, 1]);

  const valuesToMeasure = minVal === maxVal ? [minVal] : [minVal, maxVal];

  const tickFormat = scale.tickFormat(tickNumber);

  return valuesToMeasure.map((value) => {
    const defaultTickLabel = tickFormat(value as any);
    if (valueFormatter) {
      return valueFormatter(value, {
        location: 'tick',
        scale,
        defaultTickLabel,
      });
    }
    return defaultTickLabel;
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

  const allLines = new Set<string>();
  for (const label of labels) {
    const lines = label.split('\n');
    for (const line of lines) {
      allLines.add(line);
    }
  }

  const sizeMap = batchMeasureStrings(allLines, style);

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
  if (!angle || angle % 180 === 0) {
    return direction === 'x' ? height : width;
  }

  if (angle % 90 === 0) {
    return direction === 'x' ? width : height;
  }

  const radAngle = deg2rad(Math.abs(angle));
  const cosAngle = Math.cos(radAngle);
  const sinAngle = Math.sin(radAngle);

  if (direction === 'x') {
    return Math.abs(width * sinAngle) + Math.abs(height * cosAngle);
  }

  return Math.abs(width * cosAngle) + Math.abs(height * sinAngle);
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
): AxisAutoSizeResult | undefined {
  const { groups, data, tickSize: baseTickSize, tickLabelStyle: axisTickLabelStyle } = axis;
  const hasAxisLabel = Boolean(axis.label);

  if (!data || data.length === 0) {
    return { size: AXIS_AUTO_SIZE_MIN };
  }

  const groupTickSizes: number[] = [];
  const labelDimensions: number[] = [];
  const defaultTickSize = baseTickSize ?? AXIS_AUTO_SIZE_TICK_SIZE;

  for (let groupIndex = 0; groupIndex < groups.length; groupIndex += 1) {
    const group = groups[groupIndex];
    const groupLabels = selectLargestCandidates(getGroupLabels(data, group));

    const groupTickLabelStyle = {
      ...axisTickLabelStyle,
      ...group.tickLabelStyle,
    } as ChartsTextStyle | undefined;

    const angle = groupTickLabelStyle?.angle;
    const { maxWidth, maxHeight } = measureTickLabels(groupLabels, groupTickLabelStyle);

    if (maxWidth === 0 && maxHeight === 0) {
      return undefined;
    }

    const labelDimension = getRotatedDimension(maxWidth, maxHeight, angle, direction);
    labelDimensions.push(labelDimension);

    const customTickSize = group.tickSize;
    if (customTickSize !== undefined) {
      groupTickSizes.push(customTickSize);
    } else if (groupIndex === 0) {
      groupTickSizes.push(defaultTickSize);
    } else {
      // Position after previous group's labels
      const previousExtent =
        groupTickSizes[groupIndex - 1] +
        AXIS_AUTO_SIZE_TICK_LABEL_GAP +
        labelDimensions[groupIndex - 1] +
        AXIS_AUTO_SIZE_GROUP_GAP;

      groupTickSizes.push(previousExtent + defaultTickSize);
    }
  }

  const lastGroupIndex = groups.length - 1;
  let totalExtent =
    groupTickSizes[lastGroupIndex] +
    AXIS_AUTO_SIZE_TICK_LABEL_GAP +
    labelDimensions[lastGroupIndex];

  if (hasAxisLabel) {
    totalExtent += AXIS_LABEL_DEFAULT_HEIGHT;
  }

  totalExtent += AXIS_AUTO_SIZE_PADDING;

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
  const { axis, direction, domain } = options;

  if (hasGroups(axis)) {
    return computeGroupedAxisAutoSize(axis, direction);
  }

  const tickLabelStyle = axis.tickLabelStyle as ChartsTextStyle | undefined;
  const tickSize = axis.tickSize ?? AXIS_AUTO_SIZE_TICK_SIZE;
  const hasLabel = Boolean(axis.label);
  const angle = tickLabelStyle?.angle;

  const labels = getTickLabels(axis, domain);

  if (labels.length === 0) {
    return { size: AXIS_AUTO_SIZE_MIN };
  }

  const { maxWidth, maxHeight } = measureTickLabels(labels, tickLabelStyle);

  if (maxWidth === 0 && maxHeight === 0) {
    return undefined;
  }

  const labelDimension = getRotatedDimension(maxWidth, maxHeight, angle, direction);

  let totalSize = tickSize + AXIS_AUTO_SIZE_TICK_LABEL_GAP + labelDimension;

  if (hasLabel) {
    totalSize += AXIS_LABEL_DEFAULT_HEIGHT;
  }

  totalSize += AXIS_AUTO_SIZE_PADDING;

  return { size: Math.max(Math.ceil(totalSize), AXIS_AUTO_SIZE_MIN) };
}
