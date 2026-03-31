import * as React from 'react';
import { gridRowTreeSelector, gridColumnLookupSelector, } from '@mui/x-data-grid-pro';
import { useGridRegisterStrategyProcessor, createRowTree, updateRowTree, getVisibleRowsLookup, skipSorting, skipFiltering, getParentPath, RowGroupingStrategy, gridPivotActiveSelector, } from '@mui/x-data-grid-pro/internals';
import { getGroupingRules } from './gridRowGroupingUtils';
import { gridRowGroupingSanitizedModelSelector } from './gridRowGroupingSelector';
export const useGridDataSourceRowGroupingPreProcessors = (apiRef, props) => {
    const createRowTreeForRowGrouping = React.useCallback((params) => {
        const getGroupKey = props.dataSource?.getGroupKey;
        if (!getGroupKey) {
            throw new Error('MUI X: No `getGroupKey` method provided with the dataSource.');
        }
        const getChildrenCount = props.dataSource?.getChildrenCount;
        if (!getChildrenCount) {
            throw new Error('MUI X: No `getChildrenCount` method provided with the dataSource.');
        }
        const pivotingActive = gridPivotActiveSelector(apiRef);
        const sanitizedRowGroupingModel = gridRowGroupingSanitizedModelSelector(apiRef);
        const maxDepth = pivotingActive ? sanitizedRowGroupingModel.length - 1 : undefined;
        const columnsLookup = gridColumnLookupSelector(apiRef);
        const groupingRules = getGroupingRules({
            sanitizedRowGroupingModel,
            columnsLookup,
        });
        apiRef.current.caches.rowGrouping.rulesOnLastRowTreeCreation = groupingRules;
        const getRowTreeBuilderNode = (rowId) => {
            const parentPath = params.updates.groupKeys ?? getParentPath(rowId, params);
            const leafKey = getGroupKey(params.dataRowIdToModelLookup[rowId]);
            return {
                id: rowId,
                path: [...parentPath, leafKey ?? rowId.toString()].map((key, i) => ({
                    key,
                    field: groupingRules[i]?.field ?? null,
                })),
                serverChildrenCount: getChildrenCount(params.dataRowIdToModelLookup[rowId]) ?? 0,
            };
        };
        if (params.updates.type === 'full') {
            return createRowTree({
                previousTree: params.previousTree,
                nodes: params.updates.rows.map(getRowTreeBuilderNode),
                defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
                isGroupExpandedByDefault: props.isGroupExpandedByDefault,
                groupingName: RowGroupingStrategy.DataSource,
                maxDepth,
            });
        }
        return updateRowTree({
            nodes: {
                inserted: params.updates.actions.insert.map(getRowTreeBuilderNode),
                modified: params.updates.actions.modify.map(getRowTreeBuilderNode),
                removed: params.updates.actions.remove,
            },
            previousTree: params.previousTree,
            previousGroupsToFetch: params.previousGroupsToFetch,
            previousTreeDepth: params.previousTreeDepths,
            defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
            isGroupExpandedByDefault: props.isGroupExpandedByDefault,
            groupingName: RowGroupingStrategy.DataSource,
            maxDepth,
        });
    }, [apiRef, props.dataSource, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault]);
    const filterRows = React.useCallback(() => {
        const rowTree = gridRowTreeSelector(apiRef);
        return skipFiltering(rowTree);
    }, [apiRef]);
    const sortRows = React.useCallback(() => {
        const rowTree = gridRowTreeSelector(apiRef);
        return skipSorting(rowTree);
    }, [apiRef]);
    useGridRegisterStrategyProcessor(apiRef, RowGroupingStrategy.DataSource, 'rowTreeCreation', createRowTreeForRowGrouping);
    useGridRegisterStrategyProcessor(apiRef, RowGroupingStrategy.DataSource, 'filtering', filterRows);
    useGridRegisterStrategyProcessor(apiRef, RowGroupingStrategy.DataSource, 'sorting', sortRows);
    useGridRegisterStrategyProcessor(apiRef, RowGroupingStrategy.DataSource, 'visibleRowsLookupCreation', getVisibleRowsLookup);
};
