import type { FocusedItemIdentifier } from '@mui/x-charts/models';
import { getSeriesWithDefaultValues } from './getSeriesWithDefaultValues';
import keyboardFocusHandler from './keyboardFocusHandler';

const state = (align: 'left' | 'justify') => ({
  series: {
    seriesConfig: { sankey: {} as any },
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

function test(
  direction: 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown' | 'A',
  initialFocus: FocusedItemIdentifier<'sankey'> | null,
  align: 'left' | 'justify' = 'left',
) {
  return keyboardFocusHandler({ key: direction } as KeyboardEvent)?.(initialFocus, state(align));
}

describe('<Sankey /> - keyboard navigation', () => {
  describe('ArrowRight', () => {
    it('should move to the first node if no current focus', async () => {
      expect(test('ArrowRight', null)).to.deep.equal(nodeA);
    });

    it('should move to the first the first link if focus is on node', async () => {
      expect(test('ArrowRight', nodeA)).to.deep.equal(linkAC);
    });

    it('should not move if no node on the right', async () => {
      expect(test('ArrowRight', nodeE)).to.deep.equal(nodeE);
    });

    it('should move to the target node', async () => {
      expect(test('ArrowRight', linkAC)).to.deep.equal(nodeC);
    });
  });

  describe('ArrowLeft', () => {
    it('should move to the first node if no current focus', async () => {
      expect(test('ArrowLeft', null)).to.deep.equal(nodeA);
    });

    it('should move to the first the first link if focus is on node', async () => {
      expect(test('ArrowLeft', nodeC)).to.deep.equal(linkAC);
    });

    it('should not move if no node on the left', async () => {
      expect(test('ArrowLeft', nodeA)).to.deep.equal(nodeA);
    });

    it('should move to the source node', async () => {
      expect(test('ArrowLeft', linkAC)).to.deep.equal(nodeA);
    });
  });

  describe('ArrowDown', () => {
    it('should move to the first node if no current focus', async () => {
      expect(test('ArrowDown', null)).to.deep.equal(nodeA);
    });

    it('should move to next node of same layer - align=left', async () => {
      expect(test('ArrowDown', nodeC, 'left')).to.deep.equal(nodeD);
    });

    it('should move to next node of same layer - align=justify', async () => {
      expect(test('ArrowDown', nodeC, 'justify')).to.deep.equal(nodeE);
    });

    it('should loop on node of same layer', async () => {
      expect(test('ArrowDown', nodeA)).to.deep.equal(nodeB);
      expect(test('ArrowDown', nodeB)).to.deep.equal(nodeA);
    });

    it('should move to next link with same source', async () => {
      expect(test('ArrowDown', linkAC)).to.deep.equal(linkAD);
      expect(test('ArrowDown', linkAD)).to.deep.equal(linkAC);
    });

    it('should stay if source has no other link', async () => {
      expect(test('ArrowDown', linkBE)).to.deep.equal(linkBE);
    });
  });

  describe('ArrowUp', () => {
    it('should move to the first node if no current focus', async () => {
      expect(test('ArrowUp', null)).to.deep.equal(nodeA);
    });

    it('should move to next node of same layer - align=left', async () => {
      expect(test('ArrowUp', nodeC, 'left')).to.deep.equal(nodeD);
    });

    it('should move to next node of same layer - align=justify', async () => {
      expect(test('ArrowUp', nodeC, 'justify')).to.deep.equal(nodeE);
    });

    it('should loop on node of same layer', async () => {
      expect(test('ArrowUp', nodeA)).to.deep.equal(nodeB);
      expect(test('ArrowUp', nodeB)).to.deep.equal(nodeA);
    });

    it('should move to next link with same source', async () => {
      expect(test('ArrowUp', linkAC)).to.deep.equal(linkAD);
      expect(test('ArrowUp', linkAD)).to.deep.equal(linkAC);
    });

    it('should stay if source has no other link', async () => {
      expect(test('ArrowUp', linkBE)).to.deep.equal(linkBE);
    });
  });

  it('should no move is the key is not an arrow key', async () => {
    expect(test('A', null)).to.deep.equal(null);
    expect(test('A', nodeC)).to.deep.equal(nodeC);
    expect(test('A', linkAD)).to.deep.equal(linkAD);
  });
});
