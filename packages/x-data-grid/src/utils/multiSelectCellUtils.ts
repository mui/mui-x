const GAP = 4;

/**
 * Get overflow chip width based on hidden count
 * - "+9" (1 digit) = 32px
 * - "+99" (2 digits) = 38px
 * - "+999" (3+ digits) = 44px
 */
export function getOverflowChipWidth(hiddenCount: number): number {
  if (hiddenCount <= 0) {
    return 0;
  }
  if (hiddenCount < 10) {
    return 32;
  }
  if (hiddenCount < 100) {
    return 38;
  }
  return 44;
}

/**
 * Calculate how many chips fit in the available width
 */
export function calculateVisibleCount(
  arrayLength: number,
  containerWidth: number,
  chipWidths: Map<number, number>,
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
    const overflowChipWidth = getOverflowChipWidth(hiddenIfStopHere);
    const spaceNeeded =
      usedWidth +
      chipWidth +
      (count > 0 ? GAP : 0) +
      (hiddenIfStopHere > 0 ? overflowChipWidth + GAP : 0);

    // Allow 1px tolerance per chip to handle CSS subpixel rendering
    const tolerance = i + 1;
    if (spaceNeeded <= containerWidth + tolerance || i === 0) {
      usedWidth += chipWidth + (count > 0 ? GAP : 0);
      count += 1;
    } else {
      break;
    }
  }

  return count;
}
