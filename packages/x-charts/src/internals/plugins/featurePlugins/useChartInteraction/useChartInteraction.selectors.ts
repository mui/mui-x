import { createSelector } from '@mui/x-internals/store';
import { type ChartOptionalRootSelector } from '../../utils/selectors';
import { type UseChartInteractionSignature } from './useChartInteraction.types';

const selectInteraction: ChartOptionalRootSelector<UseChartInteractionSignature> = (state) =>
  state.interaction;

export const selectorChartsInteractionIsInitialized = createSelector(
  selectInteraction,
  (interaction) => interaction !== undefined,
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

export const selectorChartsLastInteraction = createSelector(
  selectInteraction,
  (interaction) => interaction?.lastUpdate,
);

export const selectorChartsPointerType = createSelector(
  selectInteraction,
  (interaction) => interaction?.pointerType ?? null,
);
