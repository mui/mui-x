import { describe, it, expect } from 'vitest';
import type { GroupedTickItemType } from '../hooks/useTicksGrouped';
import { getVisibleGroupedLabels } from './getVisibleLabels';

const tick = (
  groupIndex: number,
  offset: number,
  formattedValue?: string,
): GroupedTickItemType => ({
  groupIndex,
  offset,
  labelOffset: 0,
  formattedValue,
  value: formattedValue,
});

const options = {
  tickLabelMinGap: 15,
  isMounted: false,
  isXInside: (x: number) => x >= 0 && x <= 100,
};

const visibleValues = (ticks: GroupedTickItemType[], set: Set<GroupedTickItemType>) =>
  ticks.filter((item) => set.has(item)).map((item) => item.formattedValue);

describe('getVisibleGroupedLabels', () => {
  const groups = [{ getValue: () => '' }, { getValue: () => '' }];

  it('should resolve overlap independently for each group level', () => {
    const ticks = [
      tick(0, 0, 'a'),
      tick(0, 10, 'b'),
      tick(0, 20, 'c'),
      tick(0, 30, 'd'),
      tick(1, 5, 'X'),
      tick(1, 25, 'Y'),
    ];

    expect(visibleValues(ticks, getVisibleGroupedLabels(ticks, groups, options))).to.deep.equal([
      'a',
      'c',
      'X',
      'Y',
    ]);
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
});
