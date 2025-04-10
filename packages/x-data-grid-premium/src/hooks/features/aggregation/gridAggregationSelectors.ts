import { createSelector, createSelectorV8 } from '@mui/x-data-grid-pro/internals';
import { GridRowId, gridRowTreeSelector } from '@mui/x-data-grid';
import { GridStatePremium } from '../../../models/gridStatePremium';
import { GridAggregationPosition } from './gridAggregationInterfaces';

export const gridAggregationStateSelector = (state: GridStatePremium) => state.aggregation;

/**
 * Get the aggregation model, containing the aggregation function of each column.
 * If a column is not in the model, it is not aggregated.
 * @category Aggregation
 */
export const gridAggregationModelSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.model,
);

/**
 * Get the aggregation results as a lookup.
 * @category Aggregation
 */
export const gridAggregationLookupSelector = createSelector(
  gridAggregationStateSelector,
  (aggregationState) => aggregationState.lookup,
);

export const gridCellAggregationResultSelector = createSelectorV8(
  gridRowTreeSelector,
  gridAggregationLookupSelector,
  (rowTree, aggregationLookup, { id, field }: { id: GridRowId; field: string }) => {
    let cellAggregationPosition: GridAggregationPosition | null = null;
    const rowNode = rowTree[id];

    if (!rowNode) {
      return null;
    }

    if (rowNode.type === 'group') {
      cellAggregationPosition = 'inline';
    } else if (id.toString().startsWith('auto-generated-group-footer-')) {
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
  },
);
