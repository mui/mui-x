/* eslint-disable @typescript-eslint/naming-convention */
import type { FocusedItemIdentifier } from '@mui/x-charts/models';
import { describe, it, expect } from 'vitest';
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

function move(
  direction:
    'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown' | 'Home' | 'End' | 'PageUp' | 'PageDown',
  initialFocus: FocusedItemIdentifier<'heatmap'> | null,
  modifiers: { ctrlKey?: boolean; metaKey?: boolean } = {},
) {
  return {
    ...keyboardFocusHandler({ key: direction, ...modifiers } as KeyboardEvent)?.(
      initialFocus,
      state,
    ),
  };
}

describe('<Heatmap /> - keyboard navigation', () => {
  it('should move to the first or last node if no current focus', async () => {
    expect(move('ArrowRight', null)).to.deep.equal(cell_00);
    expect(move('ArrowLeft', null)).to.deep.equal(cell_00);
    expect(move('ArrowUp', null)).to.deep.equal(cell_00);
    expect(move('ArrowDown', null)).to.deep.equal(cell_00);
    expect(move('Home', null)).to.deep.equal(cell_00);
    expect(move('End', null)).to.deep.equal(cell_11);
  });

  it('should move to the first/last cell of the current row', () => {
    expect(move('Home', cell_01)).to.deep.equal(cell_00);
    expect(move('Home', cell_11)).to.deep.equal(cell_10);
    expect(move('End', cell_00)).to.deep.equal(cell_01);
    expect(move('End', cell_10)).to.deep.equal(cell_11);
  });

  it('should stay in place when already at the first/last cell of the row', () => {
    expect(move('Home', cell_00)).to.deep.equal(cell_00);
    expect(move('Home', cell_10)).to.deep.equal(cell_10);
    expect(move('End', cell_01)).to.deep.equal(cell_01);
    expect(move('End', cell_11)).to.deep.equal(cell_11);
  });

  it('should move to different cell', () => {
    expect(move('ArrowRight', cell_00)).to.deep.equal(cell_01);
    expect(move('ArrowLeft', cell_11)).to.deep.equal(cell_10);
    expect(move('ArrowUp', cell_10)).to.deep.equal(cell_00);
    expect(move('ArrowDown', cell_01)).to.deep.equal(cell_11);
  });

  it('should move to the first/last cell of the grid with Ctrl+Home and Ctrl+End', () => {
    expect(move('Home', cell_11, { ctrlKey: true })).to.deep.equal(cell_00);
    expect(move('Home', cell_01, { metaKey: true })).to.deep.equal(cell_00);
    expect(move('End', cell_00, { ctrlKey: true })).to.deep.equal(cell_11);
    expect(move('End', cell_10, { metaKey: true })).to.deep.equal(cell_11);
    // Stays in place when already at the boundary.
    expect(move('Home', cell_00, { ctrlKey: true })).to.deep.equal(cell_00);
    expect(move('End', cell_11, { ctrlKey: true })).to.deep.equal(cell_11);
    // Moves to the first/last cell if no current focus.
    expect(move('Home', null, { ctrlKey: true })).to.deep.equal(cell_00);
    expect(move('End', null, { ctrlKey: true })).to.deep.equal(cell_11);
  });

  it('should move to the first/last row keeping the column with PageUp and PageDown', () => {
    expect(move('PageUp', cell_10)).to.deep.equal(cell_00);
    expect(move('PageUp', cell_11)).to.deep.equal(cell_01);
    expect(move('PageDown', cell_00)).to.deep.equal(cell_10);
    expect(move('PageDown', cell_01)).to.deep.equal(cell_11);
    // Stays in place when already at the boundary.
    expect(move('PageUp', cell_00)).to.deep.equal(cell_00);
    expect(move('PageDown', cell_11)).to.deep.equal(cell_11);
    // Moves to the first/last row if no current focus.
    expect(move('PageUp', null)).to.deep.equal(cell_00);
    expect(move('PageDown', null)).to.deep.equal(cell_11);
  });

  it('should try to go outside of the range', () => {
    expect(move('ArrowRight', cell_01)).to.deep.equal(cell_01);
    expect(move('ArrowLeft', cell_10)).to.deep.equal(cell_10);
    expect(move('ArrowUp', cell_00)).to.deep.equal(cell_00);
    expect(move('ArrowDown', cell_11)).to.deep.equal(cell_11);
  });
});
