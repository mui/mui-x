import { ChartOptionalRootSelector, createSelector } from '../../utils/selectors';
import { UseChartInteractionSignature } from './useChartInteraction.types';

const selectInteraction: ChartOptionalRootSelector<UseChartInteractionSignature> = (state) =>
  state.interaction;

export const selectorChartsInteractionIsInitialized = createSelector(
  selectInteraction,
  (interaction) => interaction !== undefined,
);

export const selectorChartsInteractionItem = createSelector(
  selectInteraction,
  (interaction) => interaction?.item ?? null,
);

export const selectorChartsInteractionPointer = createSelector(
  selectInteraction,
  (interaction) => interaction?.pointer ?? null,
);

export const selectorChartsInteractionPointerX = createSelector(
  selectorChartsInteractionPointer,
  (pointer) => pointer && pointer.x,
);

export const selectorChartsInteractionPointerY = createSelector(
  selectorChartsInteractionPointer,
  (pointer) => pointer && pointer.y,
);

export const selectorChartsInteractionItemIsDefined = createSelector(
  selectorChartsInteractionItem,
  (item) => item !== null,
);
