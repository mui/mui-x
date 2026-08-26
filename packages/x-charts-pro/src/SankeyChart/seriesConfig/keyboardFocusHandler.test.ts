import type { FocusedItemIdentifier } from '@mui/x-charts/models';
import { describe, it, expect } from 'vitest';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import keyboardFocusHandler from './keyboardFocusHandler';

const state = (align: 'left' | 'justify') => ({
  series: {
    seriesConfig: { sankey: {} as any },
    idToType: new Map([['sankey-1', 'sankey' as const]]),
    defaultizedSeries: {
      sankey: {
        seriesOrder: ['sankey-1'],
        series: {
          'sankey-1': getSeriesWithDefaultValues(
            {
              type: 'sankey',
              data: {
                links: [
                  { source: 'A', target: 'C', value: 10 },
                  { source: 'A', target: 'D', value: 5 },
                  { source: 'D', target: 'E', value: 5 },
                  { source: 'B', target: 'E', value: 5 },
                ],
              },
              nodeOptions: {
                align,
              },
            },
            0,
            [],
            'light',
          ),
        },
      },
    },
  },
});

// Sankey left aligned
//
// A -- C
//   \- D -- E
// B ------/
//
// Sankey justified aligned
//
// A ------- C
//   \- D -- E
// B ------/

const nodeA = { seriesId: 'sankey-1', type: 'sankey', subType: 'node', nodeId: 'A' } as const;
const nodeB = { seriesId: 'sankey-1', type: 'sankey', subType: 'node', nodeId: 'B' } as const;
const nodeC = { seriesId: 'sankey-1', type: 'sankey', subType: 'node', nodeId: 'C' } as const;
const nodeD = { seriesId: 'sankey-1', type: 'sankey', subType: 'node', nodeId: 'D' } as const;
const nodeE = { seriesId: 'sankey-1', type: 'sankey', subType: 'node', nodeId: 'E' } as const;

const linkAC = {
  seriesId: 'sankey-1',
  type: 'sankey',
  subType: 'link',
  sourceId: 'A',
  targetId: 'C',
} as const;
const linkAD = {
  seriesId: 'sankey-1',
  type: 'sankey',
  subType: 'link',
  sourceId: 'A',
  targetId: 'D',
} as const;
const linkBE = {
  seriesId: 'sankey-1',
  type: 'sankey',
  subType: 'link',
  sourceId: 'B',
  targetId: 'E',
} as const;

function moveFocus(
  direction: 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown' | 'A',
  initialFocus: FocusedItemIdentifier<'sankey'> | null,
  align: 'left' | 'justify' = 'left',
) {
  return keyboardFocusHandler({ key: direction } as KeyboardEvent)?.(initialFocus, state(align));
}

describe('<Sankey /> - keyboard navigation', () => {
  describe('ArrowRight', () => {
    it('should move to the first node if no current focus', async () => {
      expect(moveFocus('ArrowRight', null)).to.deep.equal(nodeA);
    });

    it('should move to the first the first link if focus is on node', async () => {
      expect(moveFocus('ArrowRight', nodeA)).to.deep.equal(linkAC);
    });

    it('should not move if no node on the right', async () => {
      expect(moveFocus('ArrowRight', nodeE)).to.deep.equal(nodeE);
    });

    it('should move to the target node', async () => {
      expect(moveFocus('ArrowRight', linkAC)).to.deep.equal(nodeC);
    });
  });

  describe('ArrowLeft', () => {
    it('should move to the first node if no current focus', async () => {
      expect(moveFocus('ArrowLeft', null)).to.deep.equal(nodeA);
    });

    it('should move to the first the first link if focus is on node', async () => {
      expect(moveFocus('ArrowLeft', nodeC)).to.deep.equal(linkAC);
    });

    it('should not move if no node on the left', async () => {
      expect(moveFocus('ArrowLeft', nodeA)).to.deep.equal(nodeA);
    });

    it('should move to the source node', async () => {
      expect(moveFocus('ArrowLeft', linkAC)).to.deep.equal(nodeA);
    });
  });

  describe('ArrowDown', () => {
    it('should move to the first node if no current focus', async () => {
      expect(moveFocus('ArrowDown', null)).to.deep.equal(nodeA);
    });

    it('should move to next node of same layer - align=left', async () => {
      expect(moveFocus('ArrowDown', nodeC, 'left')).to.deep.equal(nodeD);
    });

    it('should move to next node of same layer - align=justify', async () => {
      expect(moveFocus('ArrowDown', nodeC, 'justify')).to.deep.equal(nodeE);
    });

    it('should loop on node of same layer', async () => {
      expect(moveFocus('ArrowDown', nodeA)).to.deep.equal(nodeB);
      expect(moveFocus('ArrowDown', nodeB)).to.deep.equal(nodeA);
    });

    it('should move to next link with same source', async () => {
      expect(moveFocus('ArrowDown', linkAC)).to.deep.equal(linkAD);
      expect(moveFocus('ArrowDown', linkAD)).to.deep.equal(linkAC);
    });

    it('should stay if source has no other link', async () => {
      expect(moveFocus('ArrowDown', linkBE)).to.deep.equal(linkBE);
    });
  });

  describe('ArrowUp', () => {
    it('should move to the first node if no current focus', async () => {
      expect(moveFocus('ArrowUp', null)).to.deep.equal(nodeA);
    });

    it('should move to next node of same layer - align=left', async () => {
      expect(moveFocus('ArrowUp', nodeC, 'left')).to.deep.equal(nodeD);
    });

    it('should move to next node of same layer - align=justify', async () => {
      expect(moveFocus('ArrowUp', nodeC, 'justify')).to.deep.equal(nodeE);
    });

    it('should loop on node of same layer', async () => {
      expect(moveFocus('ArrowUp', nodeA)).to.deep.equal(nodeB);
      expect(moveFocus('ArrowUp', nodeB)).to.deep.equal(nodeA);
    });

    it('should move to next link with same source', async () => {
      expect(moveFocus('ArrowUp', linkAC)).to.deep.equal(linkAD);
      expect(moveFocus('ArrowUp', linkAD)).to.deep.equal(linkAC);
    });

    it('should stay if source has no other link', async () => {
      expect(moveFocus('ArrowUp', linkBE)).to.deep.equal(linkBE);
    });
  });

  it('should no move is the key is not an arrow key', async () => {
    expect(moveFocus('A', null)).to.deep.equal(null);
    expect(moveFocus('A', nodeC)).to.deep.equal(nodeC);
    expect(moveFocus('A', linkAD)).to.deep.equal(linkAD);
  });
});
