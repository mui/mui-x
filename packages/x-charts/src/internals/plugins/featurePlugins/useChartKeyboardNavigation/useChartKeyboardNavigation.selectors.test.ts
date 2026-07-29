import {
  selectorChartsFocusedItem,
  selectorChartsFocusedOrToFocusedItem,
  selectorChartsHasFocusedItem,
  selectorChartsIsFocusVisible,
  selectorChartsItemIsFocused,
  selectorChartsKeyboardItem,
} from './useChartKeyboardNavigation.selectors';
import type { UseChartKeyboardNavigationState } from './useChartKeyboardNavigation.types';

const item = { type: 'bar', seriesId: 's1', dataIndex: 2 } as const;

const createState = (
  keyboardNavigation: Partial<UseChartKeyboardNavigationState['keyboardNavigation']>,
) =>
  ({
    keyboardNavigation: {
      item: null,
      isFocused: false,
      isFocusVisible: false,
      enabled: true,
      ...keyboardNavigation,
    },
  }) as UseChartKeyboardNavigationState;

describe('useChartKeyboardNavigation selectors', () => {
  describe('when the focus is visible', () => {
    const state = createState({ item, isFocused: true, isFocusVisible: true });

    it('exposes the focused item', () => {
      expect(selectorChartsIsFocusVisible(state)).to.equal(true);
      expect(selectorChartsFocusedItem(state)).to.deep.equal(item);
      expect(selectorChartsHasFocusedItem(state)).to.equal(true);
      expect(selectorChartsItemIsFocused(state, item)).to.equal(true);
      expect(selectorChartsKeyboardItem(state)).to.deep.equal(item);
      expect(selectorChartsFocusedOrToFocusedItem(state)).to.deep.equal(item);
    });
  });

  describe('when the chart owns the DOM focus but the focus is not visible', () => {
    const state = createState({ item, isFocused: true, isFocusVisible: false });

    it('hides the item from the focus indicator, highlight and tooltip selectors', () => {
      expect(selectorChartsIsFocusVisible(state)).to.equal(false);
      expect(selectorChartsFocusedItem(state)).to.equal(null);
      expect(selectorChartsHasFocusedItem(state)).to.equal(false);
      expect(selectorChartsItemIsFocused(state, item)).to.equal(false);
      expect(selectorChartsKeyboardItem(state)).to.equal(null);
    });

    it('still exposes the item to the accessibility description', () => {
      expect(selectorChartsFocusedOrToFocusedItem(state)).to.deep.equal(item);
    });
  });

  describe('when the chart is blurred', () => {
    const state = createState({ item, isFocused: false, isFocusVisible: false });

    it('hides the item but keeps it for the description', () => {
      expect(selectorChartsFocusedItem(state)).to.equal(null);
      expect(selectorChartsKeyboardItem(state)).to.equal(null);
      expect(selectorChartsFocusedOrToFocusedItem(state)).to.deep.equal(item);
    });
  });
});
