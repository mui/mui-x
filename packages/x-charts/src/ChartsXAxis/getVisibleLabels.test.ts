import { describe, it, expect } from 'vitest';
import type { GroupedTickItemType } from '../hooks/useTicksGrouped';
import { getVisibleGroupedLabels, getVisibleLabels } from './getVisibleLabels';

const tick = (
  groupIndex: number,
  offset: number,
  formattedValue?: string,
  dataIndex?: number,
): GroupedTickItemType => ({
  groupIndex,
  offset,
  labelOffset: 0,
  formattedValue,
  value: formattedValue,
  dataIndex,
});

const options = {
  tickLabelMinGap: 15,
  isMounted: false,
  isXInside: (x: number) => x >= 0 && x <= 100,
};

const visibleValues = (ticks: GroupedTickItemType[], set: Set<GroupedTickItemType>) =>
  ticks.filter((item) => set.has(item)).map((item) => item.formattedValue);

describe('getVisibleLabels', () => {
  it('should apply tickLabelMinGap on reversed axes', () => {
    const ticks = [tick(0, 100, 'a'), tick(0, 90, 'b'), tick(0, 80, 'c')];

    expect(
      visibleValues(ticks, getVisibleLabels(ticks, { ...options, reverse: true })),
    ).to.deep.equal(['a', 'c']);
  });
});

describe('getVisibleGroupedLabels', () => {
  const groups = [{ getValue: () => '' }, { getValue: () => '' }];

  it('should resolve overlap independently for each group level', () => {
    const ticks = [
      tick(0, 0, 'a', 0),
      tick(0, 10, 'b', 1),
      tick(0, 20, 'c', 2),
      tick(0, 30, 'd', 3),
      tick(1, 5, 'X', 0),
      tick(1, 25, 'Y', 2),
    ];

    expect(visibleValues(ticks, getVisibleGroupedLabels(ticks, groups, options))).to.deep.equal([
      'a',
      'c',
      'X',
      'Y',
    ]);
  });

  it('should show every label of a level when they fit', () => {
    const ticks = [
      tick(0, 0, 'a', 0),
      tick(0, 20, 'b', 1),
      tick(0, 40, 'c', 2),
      tick(1, 10, 'X', 0),
    ];

    expect(visibleValues(ticks, getVisibleGroupedLabels(ticks, groups, options))).to.deep.equal([
      'a',
      'b',
      'c',
      'X',
    ]);
  });

  it('should show the middle label of each parent group when not every label fits', () => {
    const ticks = [
      tick(0, 0, 'a', 0),
      tick(0, 10, 'b', 1),
      tick(0, 20, 'c', 2),
      tick(0, 30, 'd', 3),
      tick(0, 40, 'e', 4),
      tick(0, 50, 'f', 5),
      tick(1, 10, 'X', 0),
      tick(1, 40, 'Y', 3),
    ];

    expect(visibleValues(ticks, getVisibleGroupedLabels(ticks, groups, options))).to.deep.equal([
      'b',
      'e',
      'X',
      'Y',
    ]);
  });

  it('should hide a level when its middle labels do not fit either', () => {
    const ticks = [
      tick(0, 0, 'a', 0),
      tick(0, 10, 'b', 1),
      tick(0, 20, 'c', 2),
      tick(0, 30, 'd', 3),
      tick(0, 40, 'e', 4),
      tick(0, 50, 'f', 5),
      tick(1, 10, 'X', 0),
      tick(1, 40, 'Y', 3),
    ];

    expect(
      visibleValues(
        ticks,
        getVisibleGroupedLabels(ticks, groups, { ...options, tickLabelMinGap: 40 }),
      ),
    ).to.deep.equal(['X']);
  });

  it('should ignore band boundary ticks', () => {
    const ticks = [tick(1, 0), tick(1, 10, 'X'), tick(1, 100)];

    expect(visibleValues(ticks, getVisibleGroupedLabels(ticks, groups, options))).to.deep.equal([
      'X',
    ]);
  });

  it('should hide labels outside the drawing area', () => {
    const ticks = [tick(0, -10, 'a'), tick(0, 50, 'b'), tick(1, 150, 'X')];

    expect(visibleValues(ticks, getVisibleGroupedLabels(ticks, groups, options))).to.deep.equal([
      'b',
    ]);
  });

  it('should handle reversed axes', () => {
    const ticks = [tick(0, 100, 'a'), tick(0, 90, 'b'), tick(0, 80, 'c')];

    expect(
      visibleValues(ticks, getVisibleGroupedLabels(ticks, groups, { ...options, reverse: true })),
    ).to.deep.equal(['a', 'c']);
  });

  it('should apply a tickLabelInterval function per level with the index within the level', () => {
    const ticks = [
      tick(0, 0, 'a'),
      tick(0, 30, 'b'),
      tick(0, 60, 'c'),
      tick(1, 15, 'X'),
      tick(1, 45, 'Y'),
    ];
    const tickLabelInterval = (_: unknown, index: number) => index % 2 === 0;

    expect(
      visibleValues(
        ticks,
        getVisibleGroupedLabels(ticks, groups, { ...options, tickLabelInterval }),
      ),
    ).to.deep.equal(['a', 'c', 'X']);
  });
});
