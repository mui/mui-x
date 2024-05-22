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
  ...defaultItemData,
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
        highlightedReducer(defaultState, { type: 'clear-highlighted' }).isHighlighted(
          defaultItemData,
        ),
      ).to.equal(false);
    });

    describe('highlighted=same-series', () => {
      const optionsSameSeries = {
        highlighted: 'same-series',
        faded: 'same-series',
        ...defaultItemData,
      } as const;

      it('should return true when input series is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameSeries,
        } as const;
        expect(highlightedReducer(defaultState, action).isHighlighted(defaultItemData)).to.equal(
          true,
        );
      });

      it('should return false when input series is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameSeries,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isHighlighted({
            ...defaultItemData,
            seriesId: '2',
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
            ...defaultItemData,
            itemId: '2',
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
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(true);
      });
    });

    describe('highlighted=item', () => {
      const optionsItem = {
        highlighted: 'item',
        faded: 'same-series',
        ...defaultItemData,
      } as const;

      it('should return true when input item is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsItem,
        } as const;
        expect(highlightedReducer(defaultState, action).isHighlighted(defaultItemData)).to.equal(
          true,
        );
      });

      it('should return false when input item is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsItem,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isHighlighted({
            ...defaultItemData,
            itemId: '2',
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
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('highlighted=none', () => {
      const optionsNone = {
        highlighted: 'none',
        faded: 'same-series',
        ...defaultItemData,
      } as const;

      it('should return false', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsNone,
        } as const;
        expect(highlightedReducer(defaultState, action).isHighlighted(defaultItemData)).to.equal(
          false,
        );
      });
    });

    describe('highlighted=same-value', () => {
      const optionsSameValue = {
        highlighted: 'same-value',
        faded: 'same-value',
        ...defaultItemData,
      } as const;

      it('should return true when input is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameValue,
        } as const;
        expect(highlightedReducer(defaultState, action).isHighlighted(defaultItemData)).to.equal(
          true,
        );
      });

      it('should return false when input is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameValue,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isHighlighted({
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
        highlighted: 'same-series',
        faded: 'same-series',
        ...defaultItemData,
      } as const;

      it('should return false when input series and item are same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameSeries,
        } as const;
        expect(highlightedReducer(defaultState, action).isFaded(defaultItemData)).to.equal(false);
      });

      it('should return true when input series is same as highlighted but with different item', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameSeries,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return false when input series is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameSeries,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('faded=other-series', () => {
      const optionsOtherSeries = {
        highlighted: 'same-series',
        faded: 'other-series',
        ...defaultItemData,
      } as const;

      it('should return false when input series is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsOtherSeries,
        } as const;
        expect(highlightedReducer(defaultState, action).isFaded(defaultItemData)).to.equal(false);
      });

      it('should return true when input series is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsOtherSeries,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(true);
      });
    });

    describe('faded=same-value', () => {
      const optionsSameValue = {
        highlighted: 'same-value',
        faded: 'same-value',
        ...defaultItemData,
      } as const;

      it('should return false when input is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameValue,
        } as const;
        expect(highlightedReducer(defaultState, action).isFaded(defaultItemData)).to.equal(false);
      });

      it('should return true when input is same as highlighted but with different item', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameValue,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return false when input is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsSameValue,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('faded=other-value', () => {
      const optionsOtherValue = {
        highlighted: 'same-value',
        faded: 'other-value',
        ...defaultItemData,
      } as const;

      it('should return false when input is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsOtherValue,
        } as const;
        expect(highlightedReducer(defaultState, action).isFaded(defaultItemData)).to.equal(false);
      });

      it('should return true when input is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsOtherValue,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(true);
      });

      it('should return false when input is same as highlighted but with different item', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsOtherValue,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('faded=global', () => {
      const optionsGlobal = {
        highlighted: 'same-value',
        faded: 'global',
        ...defaultItemData,
      } as const;

      it('should return false when item is same as highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsGlobal,
        } as const;
        expect(highlightedReducer(defaultState, action).isFaded(defaultItemData)).to.equal(false);
      });

      it('should return true when item is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsGlobal,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return true when series is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsGlobal,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            seriesId: '2',
          }),
        ).to.equal(true);
      });

      it('should return true when value is different than highlighted', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsGlobal,
        } as const;
        expect(
          highlightedReducer(defaultState, action).isFaded({
            ...defaultItemData,
            value: '2',
          }),
        ).to.equal(true);
      });
    });

    describe('faded=none', () => {
      const optionsNone = {
        highlighted: 'same-value',
        faded: 'none',
        ...defaultItemData,
      } as const;

      it('should return false', () => {
        const action = {
          type: 'set-highlighted',
          options: optionsNone,
        } as const;
        expect(highlightedReducer(defaultState, action).isFaded(defaultItemData)).to.equal(false);
      });
    });
  });
});
