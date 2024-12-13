import { UseChartInteractionSignature } from '../internals/plugins/featurePlugins/useChartInteraction/useChartInteraction.types';
import { ChartState } from '../internals/plugins/models';
import { createSelector } from '../internals/plugins/utils/selectors';

function selectInteraction(state: ChartState<[UseChartInteractionSignature]>) {
  return state.interaction;
}

export const selectorChartsInteractionItem = createSelector(
  selectInteraction,
  (interaction) => interaction.item,
);

export const selectorChartsInteractionAxis = createSelector(
  selectInteraction,
  (interaction) => interaction.axis,
);

export const selectorChartsInteractionXAxis = createSelector(
  selectInteraction,
  (interaction) => interaction.axis.x,
);

export const selectorChartsInteractionYAxis = createSelector(
  selectInteraction,
  (interaction) => interaction.axis.y,
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

export const selectorChartsInteractionIsVoronoiEnabled = createSelector(
  selectInteraction,
  (interaction) => interaction.isVoronoiEnabled,
);
