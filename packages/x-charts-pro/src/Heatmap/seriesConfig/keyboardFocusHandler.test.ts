/* eslint-disable @typescript-eslint/naming-convention */
import type { FocusedItemIdentifier } from '@mui/x-charts/models';
import keyboardFocusHandler from './keyboardFocusHandler';

const state = {
  series: {
    seriesConfig: { heatmap: {} } as any,
    idToType: new Map([['heatmap-1', 'heatmap' as const]]),
    defaultizedSeries: {
      heatmap: {
        seriesOrder: ['heatmap-1'],
        series: {
          'heatmap-1': {
            type: 'heatmap' as const,
            id: 'heatmap-1',
            data: [
              [0, 0, 15],
              [0, 1, 10],
              [1, 1, 25],
            ] as const,
          },
        },
      },
    },
  },
  cartesianAxis: {
    axesGap: 0,
    x: [
      {
        id: 'x-1',
        scaleType: 'band' as const,
        data: [0, 1],
        zoom: undefined,
      },
    ],
    y: [
      {
        id: 'y-1',
        scaleType: 'band' as const,
        data: [0, 1],
        zoom: undefined,
      },
    ],
  },
  visibilityManager: {
    visibilityMap: new Map(),
    isControlled: false,
  },
};

const cell_00 = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 0,
  yIndex: 0,
} as const;
const cell_01 = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 1,
  yIndex: 0,
} as const;
const cell_10 = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 0,
  yIndex: 1,
} as const;
const cell_11 = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 1,
  yIndex: 1,
} as const;

function test(
  direction: 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown',
  initialFocus: FocusedItemIdentifier<'heatmap'> | null,
) {
  return {
    ...keyboardFocusHandler({ key: direction } as KeyboardEvent)?.(initialFocus, state),
  };
}

describe('<Heatmap /> - keyboard navigation', () => {
  it('should move to the first node if no current focus', async () => {
    expect(test('ArrowRight', null)).to.deep.equal(cell_00);
    expect(test('ArrowLeft', null)).to.deep.equal(cell_00);
    expect(test('ArrowUp', null)).to.deep.equal(cell_00);
    expect(test('ArrowDown', null)).to.deep.equal(cell_00);
  });

  describe('move to different cell', () => {
    expect(test('ArrowRight', cell_00)).to.deep.equal(cell_01);
    expect(test('ArrowLeft', cell_11)).to.deep.equal(cell_10);
    expect(test('ArrowUp', cell_10)).to.deep.equal(cell_00);
    expect(test('ArrowDown', cell_01)).to.deep.equal(cell_11);
  });

  describe('try to go outside of the range', () => {
    expect(test('ArrowRight', cell_01)).to.deep.equal(cell_01);
    expect(test('ArrowLeft', cell_10)).to.deep.equal(cell_10);
    expect(test('ArrowUp', cell_00)).to.deep.equal(cell_00);
    expect(test('ArrowDown', cell_11)).to.deep.equal(cell_11);
  });
});
