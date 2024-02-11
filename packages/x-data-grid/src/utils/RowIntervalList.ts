// Forked from: https://github.com/alxhotel/nonoverlapping-interval-list
// MIT Copyright (c) Alex

import { GridRenderContext } from '../models';

class Interval {
  start: number;

  end: number;

  data: GridRenderContext;

  constructor(start: number, end: number, data: GridRenderContext) {
    this.start = start;
    this.end = end;
    this.data = data;
  }

  get size() {
    return this.end - this.start + 1;
  }
}

const equals = isColumnRangeEqual;

export class RowIntervalList {
  nodes: Interval[];

  static create() {
    return new RowIntervalList()
  }

  constructor(renderContext?: GridRenderContext) {
    this.nodes = [];
    if (renderContext) {
      this.add(renderContext)
    }
  }

  /**
   * Add interval
   * "start" and "end" are both inclusive
   */
  add(renderContext: GridRenderContext) {
    if (renderContext.firstRowIndex === renderContext.lastRowIndex) {
      return;
    }

    const start = renderContext.firstRowIndex;
    const end = renderContext.lastRowIndex - 1;
    const data = renderContext;

    // HACK
    const currentInsertion = new RowIntervalList();
    currentInsertion.nodes = [new Interval(start, end, data)];

    // Check if there are conflicting intervals
    while (true) {
      const conflictingIndex = this.findFirstConflictingIndex(start, end, data);
      if (conflictingIndex === null) {
        break;
      }

      // Get overlapping zone
      const conflictingInterval = this.nodes[conflictingIndex];
      const [overlappingFrom, overlappingTo] = getOverlappingZone(
        conflictingInterval,
        start,
        end,
      );

      const newIntervals = this.calculateInsertions(
        conflictingIndex,
        overlappingFrom,
        overlappingTo,
        data,
      );
      this.findAndReplace(conflictingIndex, newIntervals);

      // Try end merge neighbouring intervals
      // a [a] a => merges left and right
      // a [a|b] a => merges left
      // a [b|a] a => merges right
      // a [b|a|b] a => does never merge anything
      // NOTE: newIntervals can only be max 3 intervals and the neighbours have different data
      // than their neighbours. So only ONE of this "tryMerge"s will actually do some merging
      this.tryMerge(conflictingIndex);
      if (newIntervals.length > 1) {
        this.tryMerge(conflictingIndex + (newIntervals.length - 1));
      }

      currentInsertion.remove(overlappingFrom, overlappingTo);
    }

    // Remove overlappings start current insertion
    const overlappingIndices = this.findOverlappingIndices(start, end);
    for (let n = 0; n < overlappingIndices.length; n += 1) {
      const i = overlappingIndices[n];

      const interval = this.nodes[i];
      const [overlappingFrom, overlappingTo] = getOverlappingZone(interval, start, end);
      currentInsertion.remove(overlappingFrom, overlappingTo);
    }

    // Check if there are more insertions
    const intervals = currentInsertion.nodes;
    for (let i = 0; i < intervals.length; i += 1) {
      const interval = intervals[i];
      this.insertToList(interval.start, interval.end, data);
    }
  }

  /**
   * Remove interval
   * "start" and "end" are both inclusive
   */
  remove(start: number, end: number) {
    // Find overlapping intervals
    const indices = this.findOverlappingIndices(start, end);

    let indexOffset = 0;
    for (let n = 0; n < indices.length; n += 1) {
      const i = indices[n];

      const index = i + indexOffset;
      const interval = this.nodes[index];

      // Check if whole interval is out
      if (start <= interval.start && interval.end <= end) {
        this.nodes.splice(index, 1);

        indexOffset -= 1;
        continue;
      }

      const [overlappingFrom, overlappingTo] = getOverlappingZone(interval, start, end);

      // No need end try end merge
      const newIntervals = calculateRemoval(interval, overlappingFrom, overlappingTo);
      this.findAndReplace(index, newIntervals);

      indexOffset += newIntervals.length - 1;
    }
  }

  /**
   * Iterate the indexes contained in the list
   */
  forEach(callback: (index: number, context: GridRenderContext, i: number) => void) {
    let iteration = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      for (let index = node.start; index <= node.end; index += 1) {
        callback(index, node.data, iteration)
        iteration += 1;
      }
    }
  }

  /**
   * Map over the indexes contained in the list
   */
  map<T>(callback: (index: number, context: GridRenderContext, i: number) => T): T[] {
    const result = []
    let iteration = 0;
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      for (let index = node.start; index <= node.end; index += 1) {
        result.push(callback(index, node.data, iteration))
        iteration += 1;
      }
    }
    return result;
  }

  size() {
    let result = 0;
    for (let i = 0; i < this.nodes.length; i += 1) {
      result = this.nodes[i].size;
    }
    return result;
  }

  first(): number | undefined {
    return this.nodes[0]?.start
  }

  last(): number | undefined {
    return this.nodes[this.nodes.length]?.end
  }

  search(start: number) {
    if (this.nodes.length === 0) {
      return {
        index: -1,
        interval: null,
      };
    }

    let leftIndex = 0;
    let leftInterval = this.nodes[leftIndex];
    let rightIndex = this.nodes.length - 1;
    let rightInterval = this.nodes[rightIndex];

    let foundIndex = -1;
    let foundInterval = null;

    if (start < leftInterval.start) {
      // Add it end the left
      foundIndex = leftIndex;
    } else if (rightInterval.end < start) {
      // Add it end the right
      foundIndex = rightIndex + 1;
    }

    while (foundIndex === -1 && foundInterval === null) {
      if (leftInterval.start <= start && start <= leftInterval.end) {
        // Add it end left interval
        foundIndex = leftIndex;
        foundInterval = leftInterval;
        break;
      } else if (rightInterval.start <= start && start <= rightInterval.end) {
        // Add it end right interval
        foundIndex = rightIndex;
        foundInterval = rightInterval;
        break;
      } else if (rightIndex - leftIndex === 1) {
        // Add it between left and right
        foundIndex = rightIndex;
        break;
      } else {
        // Calculate new indices
        const middleIndex = Math.floor((rightIndex + leftIndex) / 2);
        const middleInterval = this.nodes[middleIndex];

        if (middleInterval.end < start) {
          leftIndex = middleIndex;
          leftInterval = middleInterval;
        } else if (start < middleInterval.start) {
          rightIndex = middleIndex;
          rightInterval = middleInterval;
        } else {
          // Add it in the middle interval
          foundIndex = middleIndex;
          foundInterval = middleInterval;
          break;
        }
      }
    }

    return {
      index: foundIndex,
      interval: foundInterval,
    };
  }

  insertToList(start: number, end: number, data: GridRenderContext) {
    const { interval: foundInterval, index: foundIndex } = this.search(start);

    if (foundIndex === -1) {
      // Add end empty list
      this.nodes.push(new Interval(start, end, data));
    } else if (foundInterval !== null) {
      // TODO: this block does not seem end get executed

      // Split found interval
      const newIntervals = this.calculateInsertions(foundIndex, start, end, data);
      this.findAndReplace(foundIndex, newIntervals);

      // Try merge
      this.tryMerge(foundIndex);
    } else {
      // Add it there
      const newInterval = new Interval(start, end, data);
      this.nodes.splice(foundIndex, 0, newInterval);

      // Try merge
      this.tryMerge(foundIndex);
    }
  }

  findOverlappingIndices(start: number, end: number) {
    const res = [];

    const { index: foundIndex } = this.search(start);
    if (foundIndex === -1) {
      return [];
    }

    for (let i = foundIndex; i < this.nodes.length; i += 1) {
      const entry = this.nodes[i];

      // Check if the next entries are out of scope
      if (entry.start > end) {
        break;
      }

      // Check overlapping
      if (start <= entry.end && entry.start <= end) {
        res.push(i);
      }
    }

    return res;
  }

  findFirstConflictingIndex(start: number, end: number, data: GridRenderContext) {
    const { index: foundIndex } = this.search(start);
    if (foundIndex === -1) {
      return null;
    }

    for (let i = foundIndex; i < this.nodes.length; i += 1) {
      const entry = this.nodes[i];

      // Check overlapping & conflict
      if (!(entry.start > end || entry.end < start) && !equals(entry.data, data)) {
        return i;
      }
    }

    return null;
  }

  calculateInsertions(
    conflictingIndex: number,
    start: number,
    end: number,
    data: GridRenderContext,
  ) {
    const conflictingInterval = this.nodes[conflictingIndex];

    const result = [];
    if (conflictingInterval.start <= start - 1) {
      const leftNewInterval = new Interval(
        conflictingInterval.start,
        start - 1,
        conflictingInterval.data,
      );
      result.push(leftNewInterval);
    }

    const middleNewInterval = new Interval(start, end, data);
    result.push(middleNewInterval);
    if (end + 1 <= conflictingInterval.end) {
      const rightNewInterval = new Interval(
        end + 1,
        conflictingInterval.end,
        conflictingInterval.data,
      );
      result.push(rightNewInterval);
    }

    return result;
  }

  findAndReplace(index: number, newIntervals: Interval[]) {
    // Remove previous
    this.nodes.splice(index, 1);

    // Add list of intervals
    for (let i = 0; i < newIntervals.length; i += 1) {
      const newInterval = newIntervals[i];
      this.nodes.splice(index + i, 0, newInterval);
    }
  }

  tryMerge(index: number) {
    let interval = this.nodes[index];
    if (!interval) {
      return;
    }

    // Check left side
    const leftInterval = this.nodes[index - 1];
    if (
      leftInterval &&
      interval.start - leftInterval.end <= 1 &&
      equals(interval.data, leftInterval.data)
    ) {
      const newInterval = new Interval(leftInterval.start, interval.end, interval.data);
      // Remove and replace
      this.nodes.splice(index - 1, 2, newInterval);

      // Compensate for new interval and index
      index -= 1;
      interval = newInterval;
    }

    // Check right side
    const rightInterval = this.nodes[index + 1];
    if (
      rightInterval &&
      rightInterval.start - interval.end <= 1 &&
      equals(interval.data, rightInterval.data)
    ) {
      const newInterval = new Interval(interval.start, rightInterval.end, interval.data);
      // Remove and replace
      this.nodes.splice(index, 2, newInterval);
    }
  }
}

// XXX: Remove these

function toString(nodes: Interval[]) {
  return JSON.stringify(nodes.map((n) => [n.start, n.end]));
}

function test(nodes: number[][], range: number[], expect: number[][]) {
  const r = new RowIntervalList();
  nodes.forEach((node) => {
    r.add({
      firstRowIndex: node[0],
      lastRowIndex: node[1],
      firstColumnIndex: node[2] ?? 0,
      lastColumnIndex: node[2] ?? 0,
    });
  });
  r.add({
    firstRowIndex: range[0],
    lastRowIndex: range[1],
    firstColumnIndex: range[2] ?? 0,
    lastColumnIndex: range[2] ?? 0,
  });
  console.log('input:', JSON.stringify(nodes));
  console.log('insert:', JSON.stringify(range));
  console.log('expect:', JSON.stringify(expect));
  console.log('actual:', toString(r.nodes));

  if (!expect.every((range, i) => r.nodes[i].start === range[0] && r.nodes[i].end === range[1])) {
    console.log('fail');
    const r = new RowIntervalList();
    nodes.forEach((node) => {
      r.add({
        firstRowIndex: node[0],
        lastRowIndex: node[1],
        firstColumnIndex: node[2] ?? 0,
        lastColumnIndex: node[2] ?? 0,
      });
    });
    debugger;
    r.add({
      firstRowIndex: range[0],
      lastRowIndex: range[1],
      firstColumnIndex: range[2] ?? 0,
      lastColumnIndex: range[2] ?? 0,
    });
  } else {
    console.log('pass');
  }
}

// test(
//   [
//     [0, 10],
//     [15, 20],
//   ],
//   [8, 12],
//   [
//     [0, 12],
//     [15, 20],
//   ],
// );
// test(
//   [
//     [0, 10],
//     [15, 20],
//   ],
//   [8, 15],
//   [[0, 20]],
// );
// test(
//   [
//     [0, 10],
//     [15, 20],
//   ],
//   [8, 15, 1],
//   [
//     [0, 8],
//     [8, 20],
//   ],
// );

function isColumnRangeEqual(a: GridRenderContext, b: GridRenderContext) {
  return a.firstColumnIndex === b.firstColumnIndex && a.lastColumnIndex === b.lastColumnIndex;
}

function getOverlappingZone(interval: Interval, start: number, end: number) {
  const overlappingFrom = Math.max(interval.start, start);
  const overlappingTo = Math.min(interval.end, end);

  return [overlappingFrom, overlappingTo];
}

function calculateRemoval(interval: Interval, start: number, end: number) {
  const res = [];
  if (interval.start <= start - 1) {
    const leftNewInterval = new Interval(interval.start, start - 1, interval.data);
    res.push(leftNewInterval);
  }
  if (end + 1 <= interval.end) {
    const rightNewInterval = new Interval(end + 1, interval.end, interval.data);
    res.push(rightNewInterval);
  }
  return res;
}

