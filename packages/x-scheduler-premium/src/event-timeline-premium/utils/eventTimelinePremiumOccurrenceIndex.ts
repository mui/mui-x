/**
 * Builds an interval index for items sorted by their start position.
 */
export function createEventTimelinePremiumOccurrenceIndex<T extends { start: number; end: number }>(
  items: readonly T[],
) {
  let leafCount = 1;
  while (leafCount < items.length) {
    leafCount *= 2;
  }

  const maxEndByNode = new Float64Array(leafCount * 2);
  for (let index = 0; index < items.length; index += 1) {
    maxEndByNode[leafCount + index] = items[index].end;
  }
  for (let node = leafCount - 1; node > 0; node -= 1) {
    maxEndByNode[node] = Math.max(maxEndByNode[node * 2], maxEndByNode[node * 2 + 1]);
  }

  return function getOccurrencesInRange(start: number, end: number) {
    if (start >= end || items.length === 0) {
      return [];
    }

    let firstExcludedIndex = 0;
    let upperBound = items.length;
    while (firstExcludedIndex < upperBound) {
      const middle = Math.floor((firstExcludedIndex + upperBound) / 2);
      if (items[middle].start < end) {
        firstExcludedIndex = middle + 1;
      } else {
        upperBound = middle;
      }
    }

    const result: T[] = [];
    const visitNode = (node: number, firstIndex: number, lastIndex: number) => {
      if (firstIndex >= firstExcludedIndex || maxEndByNode[node] <= start) {
        return;
      }
      if (lastIndex - firstIndex === 1) {
        result.push(items[firstIndex]);
        return;
      }

      const middle = (firstIndex + lastIndex) / 2;
      visitNode(node * 2, firstIndex, middle);
      visitNode(node * 2 + 1, middle, lastIndex);
    };

    visitNode(1, 0, leafCount);
    return result;
  };
}
