import { createSelector, ChartRootSelector } from '../../utils/selectors';
import { UseChartIdSignature } from './useChartId.types';

const selectorChartIdState: ChartRootSelector<UseChartIdSignature> = (state) => state.id;

/**
 * Get the id attribute of the chart.
 * @param {ChartState<[UseChartIdSignature]>} state The state of the chart.
 * @returns {string} The id attribute of the chart.
 */
export const selectorChartId = createSelector(selectorChartIdState, (idState) => idState.chartId);
