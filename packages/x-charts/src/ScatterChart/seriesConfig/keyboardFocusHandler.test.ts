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

function test(
  direction: 'ArrowRight' | 'ArrowLeft',
  initialFocus: FocusedItemIdentifier<'scatter'> | null,
) {
  return keyboardFocusHandler({ key: direction } as KeyboardEvent)?.(initialFocus, state);
}

describe('<Scatter /> - keyboard navigation', () => {
  it('should move to the next item', () => {
    expect(test('ArrowRight', { type: 'scatter', seriesId: 'short', dataIndex: 0 })).to.deep.equal({
      type: 'scatter',
      seriesId: 'short',
      dataIndex: 1,
    });
  });

  it('should keep focus on the last item of a shorter series', () => {
    expect(test('ArrowRight', { type: 'scatter', seriesId: 'short', dataIndex: 1 })).to.deep.equal({
      type: 'scatter',
      seriesId: 'short',
      dataIndex: 1,
    });
  });

  it('should not move left from the first item', () => {
    expect(test('ArrowLeft', { type: 'scatter', seriesId: 'short', dataIndex: 0 })).to.deep.equal({
      type: 'scatter',
      seriesId: 'short',
      dataIndex: 0,
    });
  });
});
