import { expect } from 'chai';
import { highlightedReducer } from './highlightedReducer';

const optionsSeriesSameSeries = {
  type: 'series',
  highlighted: 'same-series',
  faded: 'same-series',
  seriesId: '1',
  itemId: '1',
} as const;

const defaultState = {
  options: null,
  isFaded: () => false,
  isHighlighted: () => false,
} as const;

describe('highlightedReducer', () => {
  it('set-highlighted should store the correct options', () => {
    const action = {
      type: 'set-highlighted',
      options: optionsSeriesSameSeries,
    } as const;
    expect(highlightedReducer(defaultState, action).options).to.deep.equal(optionsSeriesSameSeries);
  });

  it('clear-highlighted should clear the options', () => {
    const state = {
      ...defaultState,
      options: optionsSeriesSameSeries,
    } as const;
    const action = {
      type: 'clear-highlighted',
    } as const;
    expect(highlightedReducer(state, action).options).to.equal(null);
  });

  describe('isHighlighted', () => {
    it('should return false when no options are set', () => {
      expect(
        highlightedReducer(defaultState, { type: 'clear-highlighted' }).isHighlighted({
          seriesId: '1',
          itemId: '1',
          value: '1',
        }),
      ).to.equal(false);
    });

    describe('type=series', () => {
      describe('highlighted=same-series', () => {
        it('should return true when input series is same as highlighted', () => {
          const action = {
            type: 'set-highlighted',
            options: optionsSeriesSameSeries,
          } as const;
          expect(
            highlightedReducer(defaultState, action).isHighlighted({
              seriesId: '1',
              itemId: '1',
              value: '1',
            }),
          ).to.equal(true);
        });

        it('should return false when input series is different than highlighted', () => {
          const action = {
            type: 'set-highlighted',
            options: optionsSeriesSameSeries,
          } as const;
          expect(
            highlightedReducer(defaultState, action).isHighlighted({
              seriesId: '2',
              itemId: '1',
              value: '1',
            }),
          ).to.equal(false);
        });

        it('should return true when input item is different than highlighted', () => {
          const action = {
            type: 'set-highlighted',
            options: optionsSeriesSameSeries,
          } as const;
          expect(
            highlightedReducer(defaultState, action).isHighlighted({
              seriesId: '1',
              itemId: '2',
              value: '1',
            }),
          ).to.equal(true);
        });

        it('should return true when input value is different than highlighted', () => {
          const action = {
            type: 'set-highlighted',
            options: optionsSeriesSameSeries,
          } as const;
          expect(
            highlightedReducer(defaultState, action).isHighlighted({
              seriesId: '1',
              itemId: '1',
              value: '2',
            }),
          ).to.equal(true);
        });
      });
    });
  });
});
