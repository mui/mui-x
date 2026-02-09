/* eslint-disable @typescript-eslint/naming-convention */
import type { FocusedItemIdentifier } from '@mui/x-charts/models';
import keyboardFocusHandler from './keyboardFocusHandler';

const state = (withEmptyCells: boolean) => ({
  series: {
    seriesConfig: { heatmap: {} } as any,
    defaultizedSeries: {
      heatmap: {
        seriesOrder: ['heatmap-1'],
        series: {
          'heatmap-1': {
            type: 'heatmap' as const,
            id: 'heatmap-1',
            data: withEmptyCells
              ? ([
                  // Missing cells (0,1) and (1,1)
                  [0, 1, 10],
                  [1, 0, 20],
                ] as const)
              : ([
                  [0, 0, 15],
                  [0, 1, 10],
                  [1, 0, 20],
                  [1, 1, 25],
                ] as const),
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
});

// Define some constants for test cases with pattern `cell_[rowIndex][colIndex]_[isEmptyCharts]`

const cell_00_empty = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 0,
  yIndex: 0,
  dataIndex: undefined,
} as const;
const cell_01_empty = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 1,
  yIndex: 0,
  dataIndex: 1,
} as const;
const cell_10_empty = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 0,
  yIndex: 1,
  dataIndex: 0,
} as const;
const cell_11_empty = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 1,
  yIndex: 1,
  dataIndex: undefined,
} as const;

const cell_00 = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 0,
  yIndex: 0,
  dataIndex: 0,
} as const;
const cell_01 = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 1,
  yIndex: 0,
  dataIndex: 2,
} as const;
const cell_10 = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 0,
  yIndex: 1,
  dataIndex: 1,
} as const;
const cell_11 = {
  type: 'heatmap',
  seriesId: 'heatmap-1',
  xIndex: 1,
  yIndex: 1,
  dataIndex: 3,
} as const;

function test(
  direction: 'ArrowRight' | 'ArrowLeft' | 'ArrowUp' | 'ArrowDown',
  initialFocus: FocusedItemIdentifier<'heatmap'> | null,
  withEmptyCells: boolean = false,
) {
  return {
    dataIndex: undefined,
    ...keyboardFocusHandler({ key: direction } as KeyboardEvent)?.(
      initialFocus,
      state(withEmptyCells),
    ),
  };
}

describe('<Heatmap /> - keyboard navigation', () => {
  it('should move to the first node if no current focus', async () => {
    expect(test('ArrowRight', null)).to.deep.equal(cell_00);
    expect(test('ArrowLeft', null)).to.deep.equal(cell_00);
    expect(test('ArrowUp', null)).to.deep.equal(cell_00);
    expect(test('ArrowDown', null)).to.deep.equal(cell_00);
  });
  it('should move to the first node if no current focus. Even if there are no value', async () => {
    expect(test('ArrowRight', null, true)).to.deep.equal(cell_00_empty);
    expect(test('ArrowLeft', null, true)).to.deep.equal(cell_00_empty);
    expect(test('ArrowUp', null, true)).to.deep.equal(cell_00_empty);
    expect(test('ArrowDown', null, true)).to.deep.equal(cell_00_empty);
  });

  describe('move to different cell', () => {
    expect(test('ArrowRight', cell_00)).to.deep.equal(cell_01);
    expect(test('ArrowLeft', cell_11)).to.deep.equal(cell_10);
    expect(test('ArrowUp', cell_10)).to.deep.equal(cell_00);
    expect(test('ArrowDown', cell_01)).to.deep.equal(cell_11);
  });

  describe('move to empty cell', () => {
    expect(test('ArrowRight', cell_10_empty, true)).to.deep.equal(cell_11_empty);
    expect(test('ArrowLeft', cell_01_empty, true)).to.deep.equal(cell_00_empty);
    expect(test('ArrowUp', cell_10_empty, true)).to.deep.equal(cell_00_empty);
    expect(test('ArrowDown', cell_01_empty, true)).to.deep.equal(cell_11_empty);
  });

  describe('move from empty cell', () => {
    expect(test('ArrowLeft', cell_11_empty, true)).to.deep.equal(cell_10_empty);
    expect(test('ArrowRight', cell_00_empty, true)).to.deep.equal(cell_01_empty);
    expect(test('ArrowDown', cell_00_empty, true)).to.deep.equal(cell_10_empty);
    expect(test('ArrowUp', cell_11_empty, true)).to.deep.equal(cell_01_empty);
  });

  describe('try to go outside of the range', () => {
    expect(test('ArrowRight', cell_01)).to.deep.equal(cell_01);
    expect(test('ArrowLeft', cell_10)).to.deep.equal(cell_10);
    expect(test('ArrowUp', cell_00)).to.deep.equal(cell_00);
    expect(test('ArrowDown', cell_11)).to.deep.equal(cell_11);
  });
});
