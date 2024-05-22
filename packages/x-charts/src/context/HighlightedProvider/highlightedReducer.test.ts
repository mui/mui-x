import { expect } from 'chai';
import { highlightedReducer } from './highlightedReducer';

const optionsSameSeriesSameSeries = {
  highlighted: 'same-series',
  faded: 'same-series',
  seriesId: '1',
  itemId: '1',
} as const;

const optionsItemSameSeries = {
  highlighted: 'item',
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
      options: optionsSameSeriesSameSeries,
    } as const;
    expect(highlightedReducer(defaultState, action).options).to.deep.equal(
      optionsSameSeriesSameSeries,
    );
  });

  it('clear-highlighted should clear the options', () => {
    const state = {
      ...defaultState,
      options: optionsSameSeriesSameSeries,
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

    describe('highlighted=same-series', () => {
      it('should return true when input series is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameSeriesSameSeries,
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
          options: optionsSameSeriesSameSeries,
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
          options: optionsSameSeriesSameSeries,
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
          options: optionsSameSeriesSameSeries,
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

    describe('highlighted=item', () => {
      it('should return true when input item is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsItemSameSeries,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isHighlighted({
            seriesId: '1',
            itemId: '1',
            value: '1',
          }),
        ).to.equal(true);
      });

      it('should return false when input item is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsItemSameSeries,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isHighlighted({
            seriesId: '1',
            itemId: '2',
            value: '1',
          }),
        ).to.equal(false);
      });

      it('should return false when input series is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsItemSameSeries,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isHighlighted({
            seriesId: '2',
            itemId: '1',
            value: '1',
          }),
        ).to.equal(false);
      });
    });
  });
});
