import { expect } from 'chai';
import { highlightedReducer } from './highlightedReducer';

const defaultOptions = {
  highlighted: 'none',
  faded: 'none',
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
      options: defaultOptions,
    } as const;
    expect(highlightedReducer(defaultState, action).options).to.deep.equal(defaultOptions);
  });

  it('clear-highlighted should clear the options', () => {
    const state = {
      ...defaultState,
      options: defaultOptions,
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
      const optionsSameSeries = {
        highlighted: 'same-series',
        faded: 'same-series',
        seriesId: '1',
        itemId: '1',
      } as const;

      it('should return true when input series is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameSeries,
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
          options: optionsSameSeries,
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
          options: optionsSameSeries,
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
          options: optionsSameSeries,
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
      const optionsItem = {
        highlighted: 'item',
        faded: 'same-series',
        seriesId: '1',
        itemId: '1',
      } as const;

      it('should return true when input item is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsItem,
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
          options: optionsItem,
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
          options: optionsItem,
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

    describe('highlighted=none', () => {
      const optionsNone = {
        highlighted: 'none',
        faded: 'same-series',
        seriesId: '1',
        itemId: '1',
      } as const;

      it('should return false', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsNone,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isHighlighted({
            seriesId: '1',
            itemId: '1',
            value: '1',
          }),
        ).to.equal(false);
      });
    });
  });
});
