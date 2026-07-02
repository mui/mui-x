import { createSelector } from '@mui/x-internals/store';
import {
  selectorChartsKeyboardItem,
  selectorChartsHasFocusedItem,
} from '../useChartKeyboardNavigation';
import { selectorChartsLastInteraction } from '../useChartInteraction/useChartInteraction.selectors';
import type { ChartOptionalRootSelector } from '../../utils/selectors';
import type { UseChartTooltipSignature } from './useChartTooltip.types';

const selectTooltip: ChartOptionalRootSelector<UseChartTooltipSignature> = (state) => state.tooltip;

export const selectorChartsTooltipPointerItem = createSelector(
  selectTooltip,
  (tooltip) => tooltip?.item ?? null,
);

export const selectorChartsTooltipPointerItemIsDefined = createSelector(
  selectorChartsTooltipPointerItem,
  (item) => item !== null,
);

export const selectorChartsTooltipItem = createSelector(
  selectorChartsLastInteraction,
  selectorChartsTooltipPointerItem,
  selectorChartsKeyboardItem,
  (lastInteraction, pointerItem, keyboardItem) =>
    lastInteraction === 'keyboard' ? keyboardItem : (pointerItem ?? null),
);

export const selectorChartsTooltipItemIsDefined = createSelector(
  selectorChartsLastInteraction,
  selectorChartsTooltipPointerItemIsDefined,
  selectorChartsHasFocusedItem,
  (lastInteraction, pointerItemIsDefined, keyboardItemIsDefined) =>
    lastInteraction === 'keyboard' ? keyboardItemIsDefined : pointerItemIsDefined,
);
