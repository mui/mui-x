import { createSelector, createRootSelector, } from '@mui/x-data-grid-pro/internals';
import { gridRowTreeSelector } from '@mui/x-data-grid-pro';
export const gridAggregationStateSelector = createRootSelector((state) => state.aggregation);
/**
 * Get the aggregation model, containing the aggregation function of each column.
 * If a column is not in the model, it is not aggregated.
 * @category Aggregation
 */
export const gridAggregationModelSelector = createSelector(gridAggregationStateSelector, (aggregationState) => aggregationState.model);
/**
 * Get the aggregation results as a lookup.
 * @category Aggregation
 */
export const gridAggregationLookupSelector = createSelector(gridAggregationStateSelector, (aggregationState) => aggregationState.lookup);
export const gridCellAggregationResultSelector = createSelector(gridRowTreeSelector, gridAggregationLookupSelector, (rowTree, aggregationLookup, { id, field }) => {
    if (!aggregationLookup) {
        return null;
    }
    let cellAggregationPosition = null;
    const rowNode = rowTree[id];
    if (!rowNode) {
        return null;
    }
    if (rowNode.type === 'group') {
        cellAggregationPosition = 'inline';
    }
    else if (id.toString().startsWith('auto-generated-group-footer-')) {
        cellAggregationPosition = 'footer';
    }
    if (cellAggregationPosition == null) {
        return null;
    }
    // TODO: Add custom root id
    const groupId = cellAggregationPosition === 'inline' ? id : (rowNode.parent ?? '');
    const aggregationResult = aggregationLookup?.[groupId]?.[field];
    if (!aggregationResult || aggregationResult.position !== cellAggregationPosition) {
        return null;
    }
    return aggregationResult;
});
