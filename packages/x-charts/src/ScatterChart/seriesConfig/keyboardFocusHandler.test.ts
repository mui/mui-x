import { describe, it, expect } from 'vitest';
import type { FocusedItemIdentifier } from '../../models';
import { scatterSeriesConfig } from './index';
import keyboardFocusHandler from './keyboardFocusHandler';

const state = {
  seriesConfig: { config: { scatter: scatterSeriesConfig } },
  series: {
    defaultizedSeries: {
      scatter: {
        seriesOrder: ['short', 'long'],
        series: {
          short: {
            id: 'short',
            type: 'scatter',
            data: [
              { x: 1, y: 1 },
              { x: 2, y: 2 },
            ],
          },
          long: {
            id: 'long',
            type: 'scatter',
            data: [
              { x: 1, y: 1 },
              { x: 2, y: 2 },
              { x: 3, y: 3 },
            ],
          },
        },
      },
    },
  },
} as any;

function move(
  direction: 'ArrowRight' | 'ArrowLeft' | 'End',
  initialFocus: FocusedItemIdentifier<'scatter'> | null,
  { ctrlKey = false, chartState = state }: { ctrlKey?: boolean; chartState?: any } = {},
) {
  return keyboardFocusHandler({ key: direction, ctrlKey } as KeyboardEvent)?.(
    initialFocus,
    chartState,
  );
}

describe('<Scatter /> - keyboard navigation', () => {
  it('should move to the next item', () => {
    expect(move('ArrowRight', { type: 'scatter', seriesId: 'short', dataIndex: 0 })).to.deep.equal({
      type: 'scatter',
      seriesId: 'short',
      dataIndex: 1,
    });
  });

  it('should keep focus on the last item of a shorter series', () => {
    expect(move('ArrowRight', { type: 'scatter', seriesId: 'short', dataIndex: 1 })).to.deep.equal({
      type: 'scatter',
      seriesId: 'short',
      dataIndex: 1,
    });
  });

  it('should not move left from the first item', () => {
    expect(move('ArrowLeft', { type: 'scatter', seriesId: 'short', dataIndex: 0 })).to.deep.equal({
      type: 'scatter',
      seriesId: 'short',
      dataIndex: 0,
    });
  });

  it('should move to the last item of a shorter series on End', () => {
    expect(move('End', { type: 'scatter', seriesId: 'short', dataIndex: 0 })).to.deep.equal({
      type: 'scatter',
      seriesId: 'short',
      dataIndex: 1,
    });
  });

  it('should move to the last item of a shorter last series on Ctrl+End', () => {
    const reversedState = {
      ...state,
      series: {
        defaultizedSeries: {
          scatter: {
            ...state.series.defaultizedSeries.scatter,
            seriesOrder: ['long', 'short'],
          },
        },
      },
    };
    expect(
      move(
        'End',
        { type: 'scatter', seriesId: 'long', dataIndex: 0 },
        { ctrlKey: true, chartState: reversedState },
      ),
    ).to.deep.equal({
      type: 'scatter',
      seriesId: 'short',
      dataIndex: 1,
    });
  });
});
