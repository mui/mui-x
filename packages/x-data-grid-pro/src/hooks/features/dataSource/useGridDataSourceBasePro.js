'use client';
import * as React from 'react';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import useLazyRef from '@mui/utils/useLazyRef';
import { useGridSelector, GridGetRowsError, gridRowIdSelector, gridRowNodeSelector, gridRowTreeSelector, GRID_ROOT_GROUP_ID, gridRowsLookupSelector, } from '@mui/x-data-grid';
import { gridRowGroupsToFetchSelector, useGridDataSourceBase, CacheChunkManager, gridGetRowsParamsSelector, DataSourceRowsUpdateStrategy, GridStrategyGroup, getTreeNodeDescendants, } from '@mui/x-data-grid/internals';
import { warnOnce } from '@mui/x-internals/warning';
import { NestedDataManager, RequestStatus, getGroupKeys } from './utils';
import { gridDataSourceErrorsSelector } from './gridDataSourceSelector';
export const INITIAL_STATE = {
    loading: {},
    errors: {},
};
export const useGridDataSourceBasePro = (apiRef, props, options = {}) => {
    const groupsToAutoFetch = useGridSelector(apiRef, gridRowGroupsToFetchSelector);
    const nestedDataManager = useLazyRef(() => new NestedDataManager(apiRef)).current;
    const scheduledGroups = React.useRef(0);
    const clearDataSourceState = React.useCallback(() => {
        nestedDataManager.clear();
        scheduledGroups.current = 0;
        const dataSourceState = apiRef.current.state.dataSource;
        if (dataSourceState !== INITIAL_STATE) {
            apiRef.current.resetDataSourceState();
        }
        return null;
    }, [apiRef, nestedDataManager]);
    const handleEditRow = React.useCallback((params, updatedRow) => {
        if (updatedRow && !isDeepEqual(updatedRow, params.previousRow)) {
            // Reset the outdated cache, only if the row is _actually_ updated
            apiRef.current.dataSource.cache.clear();
        }
        const groupKeys = getGroupKeys(gridRowTreeSelector(apiRef), params.rowId);
        apiRef.current.updateNestedRows([updatedRow], groupKeys);
    }, [apiRef]);
    const { api, debouncedFetchRows, strategyProcessor: flatTreeStrategyProcessor, events, startPolling, cacheChunkManager, cache, } = useGridDataSourceBase(apiRef, props, {
        fetchRowChildren: nestedDataManager.queue,
        clearDataSourceState,
        handleEditRow,
        ...options,
    });
    const setStrategyAvailability = React.useCallback(() => {
        const currentStrategy = props.treeData
            ? DataSourceRowsUpdateStrategy.GroupedData
            : DataSourceRowsUpdateStrategy.Default;
        const prevStrategy = currentStrategy === DataSourceRowsUpdateStrategy.GroupedData
            ? DataSourceRowsUpdateStrategy.Default
            : DataSourceRowsUpdateStrategy.GroupedData;
        apiRef.current.setStrategyAvailability(GridStrategyGroup.DataSource, prevStrategy, () => false);
        apiRef.current.setStrategyAvailability(GridStrategyGroup.DataSource, currentStrategy, props.dataSource && !props.lazyLoading ? () => true : () => false);
    }, [apiRef, props.dataSource, props.lazyLoading, props.treeData]);
    const onDataSourceErrorProp = props.onDataSourceError;
    const replaceGroupRows = React.useCallback((groupId, groupPath, rows) => {
        const tree = gridRowTreeSelector(apiRef);
        const rowsLookup = gridRowsLookupSelector(apiRef);
        const fetchedRowIds = new Set(rows.map((row) => gridRowIdSelector(apiRef, row)));
        const currentGroupRows = getTreeNodeDescendants(tree, groupId, false, true);
        const rowsToDelete = [];
        currentGroupRows.forEach((rowId) => {
            if (fetchedRowIds.has(rowId)) {
                return;
            }
            const descendants = getTreeNodeDescendants(tree, rowId, false, false);
            for (let i = descendants.length - 1; i >= 0; i -= 1) {
                const descendantId = descendants[i];
                if (fetchedRowIds.has(descendantId)) {
                    continue;
                }
                rowsToDelete.push({ ...rowsLookup[descendantId], _action: 'delete' });
            }
            rowsToDelete.push({ ...rowsLookup[rowId], _action: 'delete' });
        });
        if (rowsToDelete.length > 0) {
            apiRef.current.updateNestedRows(rowsToDelete, groupPath);
        }
        apiRef.current.updateNestedRows(rows, groupPath);
    }, [apiRef]);
    const fetchRowChildren = React.useCallback(async (id) => {
        const pipedParams = apiRef.current.unstable_applyPipeProcessors('getRowsParams', {});
        if (!props.treeData && (pipedParams.groupFields?.length ?? 0) === 0) {
            nestedDataManager.clearPendingRequest(id);
            return;
        }
        const getRows = props.dataSource?.getRows;
        if (!getRows) {
            nestedDataManager.clearPendingRequest(id);
            return;
        }
        const rowNode = apiRef.current.getRowNode(id);
        if (!rowNode) {
            nestedDataManager.clearPendingRequest(id);
            return;
        }
        const fetchParams = {
            ...gridGetRowsParamsSelector(apiRef),
            ...pipedParams,
            groupKeys: rowNode.path,
        };
        const cacheKeys = cacheChunkManager.getCacheKeys(fetchParams);
        const responses = cacheKeys.map((cacheKey) => cache.get(cacheKey));
        const cachedData = responses.some((response) => response === undefined)
            ? undefined
            : CacheChunkManager.mergeResponses(responses);
        if (cachedData !== undefined) {
            const rows = cachedData.rows;
            nestedDataManager.setRequestSettled(id);
            replaceGroupRows(id, rowNode.path, rows);
            if (cachedData.rowCount !== undefined) {
                apiRef.current.setRowCount(cachedData.rowCount);
            }
            apiRef.current.setRowChildrenExpansion(id, true);
            apiRef.current.dataSource.setChildrenLoading(id, false);
            return;
        }
        const existingError = gridDataSourceErrorsSelector(apiRef)[id] ?? null;
        if (existingError) {
            apiRef.current.dataSource.setChildrenFetchError(id, null);
        }
        try {
            const getRowsResponse = await getRows(fetchParams);
            if (!apiRef.current.getRowNode(id)) {
                // The row has been removed from the grid
                nestedDataManager.clearPendingRequest(id);
                return;
            }
            if (nestedDataManager.getRequestStatus(id) === RequestStatus.UNKNOWN) {
                apiRef.current.dataSource.setChildrenLoading(id, false);
                return;
            }
            nestedDataManager.setRequestSettled(id);
            const cacheResponses = cacheChunkManager.splitResponse(fetchParams, getRowsResponse);
            cacheResponses.forEach((response, key) => {
                cache.set(key, response);
            });
            if (getRowsResponse.rowCount !== undefined) {
                apiRef.current.setRowCount(getRowsResponse.rowCount);
            }
            replaceGroupRows(id, rowNode.path, getRowsResponse.rows);
            apiRef.current.setRowChildrenExpansion(id, true);
        }
        catch (error) {
            const childrenFetchError = error;
            apiRef.current.dataSource.setChildrenFetchError(id, childrenFetchError);
            if (typeof onDataSourceErrorProp === 'function') {
                onDataSourceErrorProp(new GridGetRowsError({
                    message: childrenFetchError.message,
                    params: fetchParams,
                    cause: childrenFetchError,
                }));
            }
            else {
                warnOnce([
                    'MUI X: A call to `dataSource.getRows()` threw an error which was not handled because `onDataSourceError()` is missing.',
                    'To handle the error pass a callback to the `onDataSourceError` prop, for example `<DataGrid onDataSourceError={(error) => ...} />`.',
                    'For more detail, see https://mui.com/x/react-data-grid/server-side-data/#error-handling.',
                ], 'error');
            }
        }
        finally {
            apiRef.current.dataSource.setChildrenLoading(id, false);
            nestedDataManager.setRequestSettled(id);
        }
    }, [
        nestedDataManager,
        cacheChunkManager,
        cache,
        onDataSourceErrorProp,
        replaceGroupRows,
        apiRef,
        props.treeData,
        props.dataSource?.getRows,
    ]);
    const setChildrenLoading = React.useCallback((parentId, isLoading) => {
        apiRef.current.setState((state) => {
            if (!state.dataSource.loading[parentId] && isLoading === false) {
                return state;
            }
            const newLoadingState = { ...state.dataSource.loading };
            if (isLoading === false) {
                delete newLoadingState[parentId];
            }
            else {
                newLoadingState[parentId] = isLoading;
            }
            return {
                ...state,
                dataSource: {
                    ...state.dataSource,
                    loading: newLoadingState,
                },
            };
        });
    }, [apiRef]);
    const setChildrenFetchError = React.useCallback((parentId, error) => {
        apiRef.current.setState((state) => {
            const newErrorsState = { ...state.dataSource.errors };
            if (error === null && newErrorsState[parentId] !== undefined) {
                delete newErrorsState[parentId];
            }
            else {
                newErrorsState[parentId] = error;
            }
            return {
                ...state,
                dataSource: {
                    ...state.dataSource,
                    errors: newErrorsState,
                },
            };
        });
    }, [apiRef]);
    const resetDataSourceState = React.useCallback(() => {
        apiRef.current.setState((state) => {
            return {
                ...state,
                dataSource: INITIAL_STATE,
            };
        });
    }, [apiRef]);
    const removeChildrenRows = React.useCallback((parentId) => {
        const rowsLookup = gridRowsLookupSelector(apiRef);
        const rowNode = gridRowNodeSelector(apiRef, parentId);
        if (!rowNode || rowNode.type !== 'group' || rowNode.children.length === 0) {
            return;
        }
        const removedRows = [];
        const traverse = (nodeId) => {
            const node = gridRowNodeSelector(apiRef, nodeId);
            if (!node) {
                return;
            }
            if (node.type === 'group' && node.children.length > 0) {
                node.children.forEach(traverse);
            }
            removedRows.push({ ...rowsLookup[nodeId], _action: 'delete' });
        };
        rowNode.children.forEach(traverse);
        if (removedRows.length > 0) {
            apiRef.current.updateNestedRows(removedRows, rowNode.path);
        }
    }, [apiRef]);
    const handleGroupedDataUpdate = React.useCallback((params) => {
        if ('error' in params) {
            apiRef.current.setRows([]);
            return;
        }
        const { response, options: { keepChildrenExpanded }, } = params;
        if (response.rowCount !== undefined) {
            apiRef.current.setRowCount(response.rowCount);
        }
        if (keepChildrenExpanded === false) {
            apiRef.current.setRows(response.rows);
        }
        else {
            const tree = gridRowTreeSelector(apiRef);
            const rowsLookup = gridRowsLookupSelector(apiRef);
            // Remove existing outdated rows before setting the new ones
            // Create a set of the current root rows
            const parentRowsToDelete = new Set(getTreeNodeDescendants(tree, GRID_ROOT_GROUP_ID, false, true));
            // Remove from the list the rows that are again in the response
            response.rows.forEach((row) => {
                parentRowsToDelete.delete(gridRowIdSelector(apiRef, row));
            });
            const rowsToDelete = [];
            if (parentRowsToDelete.size > 0) {
                parentRowsToDelete.forEach((parentRowId) => {
                    const descendants = getTreeNodeDescendants(tree, parentRowId, false, false);
                    for (let i = descendants.length - 1; i >= 0; i -= 1) {
                        // delete deepest descendants first
                        rowsToDelete.push({ ...rowsLookup[descendants[i]], _action: 'delete' });
                    }
                    rowsToDelete.push({ ...rowsLookup[parentRowId], _action: 'delete' });
                });
            }
            apiRef.current.updateRows(response.rows.concat(rowsToDelete));
        }
        apiRef.current.unstable_applyPipeProcessors('processDataSourceRows', { params: params.fetchParams, response }, true);
        startPolling();
    }, [apiRef, startPolling]);
    const dataSourceApi = {
        dataSource: {
            ...api.public.dataSource,
            setChildrenLoading,
            setChildrenFetchError,
        },
    };
    const dataSourcePrivateApi = {
        fetchRowChildren,
        resetDataSourceState,
        removeChildrenRows,
    };
    React.useEffect(() => {
        if (groupsToAutoFetch &&
            groupsToAutoFetch.length &&
            scheduledGroups.current < groupsToAutoFetch.length) {
            const groupsToSchedule = groupsToAutoFetch.slice(scheduledGroups.current);
            nestedDataManager.queue(groupsToSchedule);
            scheduledGroups.current = groupsToAutoFetch.length;
        }
    }, [apiRef, nestedDataManager, groupsToAutoFetch]);
    return {
        api: { public: dataSourceApi, private: dataSourcePrivateApi },
        debouncedFetchRows,
        flatTreeStrategyProcessor,
        groupedDataStrategyProcessor: {
            strategyName: DataSourceRowsUpdateStrategy.GroupedData,
            group: 'dataSourceRowsUpdate',
            processor: handleGroupedDataUpdate,
        },
        events,
        setStrategyAvailability,
        cacheChunkManager,
        cache,
    };
};
