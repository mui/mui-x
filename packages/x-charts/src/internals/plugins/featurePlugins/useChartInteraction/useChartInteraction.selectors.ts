import { ChartOptionalRootSelector, createChartSelector } from '../../utils/selectors';
import { UseChartInteractionSignature } from './useChartInteraction.types';

const selectInteraction: ChartOptionalRootSelector<UseChartInteractionSignature> = (state) =>
  state.interaction;

export const selectorChartsInteractionIsInitialized = createChartSelector(
  [selectInteraction],
  (interaction) => interaction !== undefined,
);

export const selectorChartsInteractionItem = createChartSelector(
  [selectInteraction],
  (interaction) => interaction?.item ?? null,
);

export const selectorChartsInteractionPointer = createChartSelector(
  [selectInteraction],
  (interaction) => interaction?.pointer ?? null,
);

export const selectorChartsInteractionPointerX = createChartSelector(
  [selectorChartsInteractionPointer],
  (pointer) => pointer && pointer.x,
);

export const selectorChartsInteractionPointerY = createChartSelector(
  [selectorChartsInteractionPointer],
  (pointer) => pointer && pointer.y,
);

export const selectorChartsInteractionItemIsDefined = createChartSelector(
  [selectorChartsInteractionItem],
  (item) => item !== null,
);

export const selectorChartsLastInteraction = createChartSelector(
  [selectInteraction],
  (interaction) => interaction?.lastUpdate,
);
