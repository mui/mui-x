/**
 * Fallback overflow chip widths used before the singleton measurer reports its first
 * measurement (e.g. SSR, very first paint). Calibrated for the default Material small
 * outlined chip rendering "+9", "+99", "+999".
 */
export const DEFAULT_OVERFLOW_CHIP_WIDTHS = [32, 38, 44];

/** Fallback gap between sibling chips, mirrors the default `gap: 4` in `MultiSelectChips`. */
export const DEFAULT_GAP = 4;

/**
 * Get overflow chip width for a given hidden count, given a measured widths table.
 * `widths[0]` covers 1 digit, `widths[1]` 2 digits, `widths[2]` 3 digits. Counts beyond
 * the table reuse the last entry — the measurer only renders 1/2/3-digit samples since
 * 10⁴+ hidden chips is unlikely in practice and would still overflow visibly anyway.
 */
export function getOverflowChipWidth(
  hiddenCount: number,
  widths: number[] = DEFAULT_OVERFLOW_CHIP_WIDTHS,
): number {
  if (hiddenCount <= 0) {
    return 0;
  }
  if (widths.length === 0) {
    return 0;
  }
  const digits = String(hiddenCount).length;
  return widths[Math.min(digits - 1, widths.length - 1)];
}

/**
 * Calculate how many chips fit in the available width.
 * `overflowChipWidths` and `gap` come from the per-grid measurer; callers may omit them
 * to use the calibrated defaults during the first render before the measurer reports.
 */
export function calculateVisibleCount(
  arrayLength: number,
  containerWidth: number,
  chipWidths: Map<number, number>,
  overflowChipWidths: number[] = DEFAULT_OVERFLOW_CHIP_WIDTHS,
  gap: number = DEFAULT_GAP,
): number {
  let usedWidth = 0;
  let count = 0;

  for (let i = 0; i < arrayLength; i += 1) {
    const chipWidth = chipWidths.get(i);
    if (chipWidth === undefined) {
      // Not all chips measured yet, show up to this point
      return i;
    }

    const hiddenIfStopHere = arrayLength - (i + 1);
    const overflowChipWidth = getOverflowChipWidth(hiddenIfStopHere, overflowChipWidths);
    const spaceNeeded =
      usedWidth +
      chipWidth +
      (count > 0 ? gap : 0) +
      (hiddenIfStopHere > 0 ? overflowChipWidth + gap : 0);

    // Both `containerWidth` and chip widths are read via getBoundingClientRect (sub-
    // pixel), so no tolerance needed — the math matches the laid-out widths exactly.
    if (spaceNeeded <= containerWidth || i === 0) {
      usedWidth += chipWidth + (count > 0 ? gap : 0);
      count += 1;
    } else {
      break;
    }
  }

  return count;
}
