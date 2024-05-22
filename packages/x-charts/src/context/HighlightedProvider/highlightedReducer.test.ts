import { expect } from 'chai';
import { highlightedReducer } from './highlightedReducer';

const defaultItemData = {
  seriesId: '1s',
  itemId: '1i',
  value: '1v',
};

const defaultOptions = {
  highlighted: 'none',
  faded: 'none',
} as const;

const defaultState = {
  options: null,
  highlightedItem: null,
  isFaded: () => false,
  isHighlighted: () => false,
} as const;

const setHighlightedAction = {
  type: 'set-highlighted',
  itemData: defaultItemData,
} as const;

describe('highlightedReducer', () => {
  it('set-highlighted should store the correct options', () => {
    expect(highlightedReducer(defaultState, setHighlightedAction).options).to.deep.equal(
      defaultOptions,
    );
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

  it('should return the same state when no action is matched', () => {
    const action = {
      type: 'unknown',
    } as const;
    // @ts-expect-error
    expect(highlightedReducer(defaultState, action)).to.equal(defaultState);
  });

  describe('isHighlighted', () => {
    it('should return false when no options are set', () => {
      expect(
        highlightedReducer(defaultState, { type: 'clear-highlighted' }).isHighlighted(
          defaultItemData,
        ),
      ).to.equal(false);
    });

    describe('highlighted=same-series', () => {
      const optionsSameSeries = {
        ...defaultState,
        highlighted: 'same-series',
        faded: 'same-series',
      } as const;

      it('should return true when input series is same as highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isHighlighted(
            defaultItemData,
          ),
        ).to.equal(true);
      });

      it('should return false when input series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isHighlighted({
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(false);
      });

      it('should return true when input item is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isHighlighted({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return true when input value is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isHighlighted({
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(true);
      });
    });

    describe('highlighted=item', () => {
      const optionsItem = {
        ...defaultState,
        highlighted: 'item',
        faded: 'same-series',
      } as const;

      it('should return true when input item is same as highlighted', () => {
        expect(
          highlightedReducer(optionsItem, setHighlightedAction).isHighlighted(defaultItemData),
        ).to.equal(true);
      });

      it('should return false when input item is different than highlighted', () => {
        expect(
          highlightedReducer(optionsItem, setHighlightedAction).isHighlighted({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(false);
      });

      it('should return false when input series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsItem, setHighlightedAction).isHighlighted({
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('highlighted=none', () => {
      const optionsNone = {
        ...defaultState,
        highlighted: 'none',
        faded: 'same-series',
      } as const;

      it('should return false', () => {
        expect(
          highlightedReducer(optionsNone, setHighlightedAction).isHighlighted(defaultItemData),
        ).to.equal(false);
      });
    });

    describe('highlighted=same-value', () => {
      const optionsSameValue = {
        ...defaultState,
        highlighted: 'same-value',
        faded: 'same-value',
      } as const;

      it('should return true when input is same as highlighted', () => {
        expect(
          highlightedReducer(optionsSameValue, setHighlightedAction).isHighlighted(defaultItemData),
        ).to.equal(true);
      });

      it('should return false when input is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameValue, setHighlightedAction).isHighlighted({
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(false);
      });
    });
  });

  describe('isFaded', () => {
    it('should return false when no options are set', () => {
      expect(
        highlightedReducer(defaultState, { type: 'clear-highlighted' }).isFaded(defaultItemData),
      ).to.equal(false);
    });

    describe('faded=same-series', () => {
      const optionsSameSeries = {
        ...defaultState,
        highlighted: 'same-series',
        faded: 'same-series',
      } as const;

      it('should return false when input series and item are same as highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isFaded(defaultItemData),
        ).to.equal(false);
      });

      it('should return true when input series is same as highlighted but with different item', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isFaded({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return false when input series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isFaded({
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('faded=other-series', () => {
      const optionsOtherSeries = {
        ...defaultState,
        highlighted: 'same-series',
        faded: 'other-series',
      } as const;

      it('should return false when input series is same as highlighted', () => {
        expect(
          highlightedReducer(optionsOtherSeries, setHighlightedAction).isFaded(defaultItemData),
        ).to.equal(false);
      });

      it('should return true when input series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsOtherSeries, setHighlightedAction).isFaded({
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(true);
      });
    });

    describe('faded=same-value', () => {
      const optionsSameValue = {
        ...defaultState,
        highlighted: 'same-value',
        faded: 'same-value',
      } as const;

      it('should return false when input is same as highlighted', () => {
        expect(
          highlightedReducer(optionsSameValue, setHighlightedAction).isFaded(defaultItemData),
        ).to.equal(false);
      });

      it('should return true when input is same as highlighted but with different item', () => {
        expect(
          highlightedReducer(optionsSameValue, setHighlightedAction).isFaded({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return false when input is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameValue, setHighlightedAction).isFaded({
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('faded=other-value', () => {
      const optionsOtherValue = {
        ...defaultState,
        highlighted: 'same-value',
        faded: 'other-value',
      } as const;

      it('should return false when input is same as highlighted', () => {
        expect(
          highlightedReducer(optionsOtherValue, setHighlightedAction).isFaded(defaultItemData),
        ).to.equal(false);
      });

      it('should return true when input is different than highlighted', () => {
        expect(
          highlightedReducer(optionsOtherValue, setHighlightedAction).isFaded({
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(true);
      });

      it('should return false when input is same as highlighted but with different item', () => {
        expect(
          highlightedReducer(optionsOtherValue, setHighlightedAction).isFaded({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('faded=global', () => {
      const optionsGlobal = {
        ...defaultState,
        highlighted: 'same-value',
        faded: 'global',
      } as const;

      it('should return false when item is same as highlighted', () => {
        expect(
          highlightedReducer(optionsGlobal, setHighlightedAction).isFaded(defaultItemData),
        ).to.equal(false);
      });

      it('should return true when item is different than highlighted', () => {
        expect(
          highlightedReducer(optionsGlobal, setHighlightedAction).isFaded({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return true when series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsGlobal, setHighlightedAction).isFaded({
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(true);
      });

      it('should return true when value is different than highlighted', () => {
        expect(
          highlightedReducer(optionsGlobal, setHighlightedAction).isFaded({
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(true);
      });
    });

    describe('faded=none', () => {
      const optionsNone = {
        ...defaultState,
        highlighted: 'same-value',
        faded: 'none',
      } as const;

      it('should return false', () => {
        expect(
          highlightedReducer(optionsNone, setHighlightedAction).isFaded(defaultItemData),
        ).to.equal(false);
      });
    });
  });
});
