import { expect } from 'chai';
import { highlightedReducer } from './highlightedReducer';

const itemData = {
  seriesId: '1s',
  itemId: '1i',
  value: '1v',
};

const noneOptions = {
  highlight: 'none',
  fade: 'none',
} as const;

const createDefaultState = () =>
  ({
    options: undefined,
    highlightedItem: null,
    isFaded: () => false,
    isHighlighted: () => false,
  }) as const;

const setHighlightedAction = {
  type: 'set-highlighted',
  itemData,
} as const;

describe('highlightedReducer', () => {
  it('set-options should store the correct options', () => {
    expect(
      highlightedReducer(createDefaultState(), {
        type: 'set-options',
        options: noneOptions,
      }).options,
    ).to.deep.equal(noneOptions);
  });

  it('clear-options should clear the current options', () => {
    const state = {
      ...createDefaultState(),
      options: noneOptions,
    } as const;
    const action = {
      type: 'clear-options',
    } as const;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(highlightedReducer(state, action).options).to.be.undefined;
  });

  it('set-highlighted should store the correct highlightedItem', () => {
    expect(
      highlightedReducer(createDefaultState(), setHighlightedAction).highlightedItem,
    ).to.deep.equal(itemData);
  });

  it('clear-highlighted should clear the current item', () => {
    const state = {
      ...createDefaultState(),
      options: noneOptions,
      highlightedItem: itemData,
    } as const;
    const action = {
      type: 'clear-highlighted',
    } as const;
    expect(highlightedReducer(state, action).highlightedItem).to.equal(null);
  });

  it('should return the same state when no action is matched', () => {
    const action = {
      type: 'unknown',
    } as const;
    const state = createDefaultState();
    // @ts-expect-error
    expect(highlightedReducer(state, action)).to.equal(state);
  });

  describe('isHighlighted', () => {
    it('should return false when no options are set', () => {
      expect(
        highlightedReducer(createDefaultState(), { type: 'clear-highlighted' }).isHighlighted(
          itemData,
        ),
      ).to.equal(false);
    });

    describe('highlighted=same-series', () => {
      const optionsSameSeries = {
        ...createDefaultState(),
        options: { highlight: 'same-series' },
      } as const;

      it('should return true when input series is same as highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isHighlighted(itemData),
        ).to.equal(true);
      });

      it('should return false when input series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isHighlighted({
            ...itemData,
            seriesId: '2',
          }),
        ).to.equal(false);
      });

      it('should return true when input item is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isHighlighted({
            ...itemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });
    });

    describe('highlighted=item', () => {
      const optionsItem = {
        ...createDefaultState(),
        options: { highlight: 'item' },
      } as const;

      it('should return true when input item is same as highlighted', () => {
        expect(
          highlightedReducer(optionsItem, setHighlightedAction).isHighlighted(itemData),
        ).to.equal(true);
      });

      it('should return false when input item is different than highlighted', () => {
        expect(
          highlightedReducer(optionsItem, setHighlightedAction).isHighlighted({
            ...itemData,
            itemId: '2',
          }),
        ).to.equal(false);
      });

      it('should return false when input series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsItem, setHighlightedAction).isHighlighted({
            ...itemData,
            seriesId: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('highlighted=none', () => {
      const optionsNone = {
        ...createDefaultState(),
        options: { highlight: 'none' },
      } as const;

      it('should return false', () => {
        expect(
          highlightedReducer(optionsNone, setHighlightedAction).isHighlighted(itemData),
        ).to.equal(false);
      });
    });
  });

  describe('isFaded', () => {
    it('should return false when no options are set', () => {
      expect(
        highlightedReducer(createDefaultState(), { type: 'clear-highlighted' }).isFaded(itemData),
      ).to.equal(false);
    });

    describe('faded=same-series', () => {
      const optionsSameSeries = {
        ...createDefaultState(),
        options: { fade: 'same-series' },
      } as const;

      it('should return true when input series is same as highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isFaded({
            ...itemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return false when input series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsSameSeries, setHighlightedAction).isFaded({
            ...itemData,
            seriesId: '2',
          }),
        ).to.equal(false);
      });
    });

    describe('faded=global', () => {
      const optionsGlobal = {
        ...createDefaultState(),
        options: { fade: 'global' },
      } as const;

      it('should return false when item is same as highlighted', () => {
        expect(highlightedReducer(optionsGlobal, setHighlightedAction).isFaded(itemData)).to.equal(
          false,
        );
      });

      it('should return true when item is different than highlighted', () => {
        expect(
          highlightedReducer(optionsGlobal, setHighlightedAction).isFaded({
            ...itemData,
            itemId: '2',
          }),
        ).to.equal(true);
      });

      it('should return true when series is different than highlighted', () => {
        expect(
          highlightedReducer(optionsGlobal, setHighlightedAction).isFaded({
            ...itemData,
            seriesId: '2',
          }),
        ).to.equal(true);
      });
    });

    describe('faded=none', () => {
      const optionsNone = {
        ...createDefaultState(),
        options: { fade: 'none' },
      } as const;

      it('should return false', () => {
        expect(highlightedReducer(optionsNone, setHighlightedAction).isFaded(itemData)).to.equal(
          false,
        );
      });
    });
  });
});
