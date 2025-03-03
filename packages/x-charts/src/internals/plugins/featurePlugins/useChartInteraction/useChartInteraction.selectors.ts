import { ChartOptionalRootSelector, createSelector } from '../../utils/selectors';
import { AxisInteractionData, UseChartInteractionSignature } from './useChartInteraction.types';

const EMPTY_AXIS_INTERACTION: AxisInteractionData = { x: null, y: null };

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

export const selectorChartsInteractionAxis = createSelector(
  selectInteraction,
  (interaction) => interaction?.axis ?? EMPTY_AXIS_INTERACTION,
);

export const selectorChartsInteractionXAxis = createSelector(
  selectorChartsInteractionAxis,
  (axis) => axis.x,
);

export const selectorChartsInteractionYAxis = createSelector(
  selectorChartsInteractionAxis,
  (axis) => axis.y,
);

export const selectorChartsInteractionItemIsDefined = createSelector(
  selectorChartsInteractionItem,
  (item) => item !== null,
);

export const selectorChartsInteractionXAxisIsDefined = createSelector(
  selectorChartsInteractionXAxis,
  (x) => x !== null,
);

export const selectorChartsInteractionYAxisIsDefined = createSelector(
  selectorChartsInteractionYAxis,
  (y) => y !== null,
);
