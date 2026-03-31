'use client';
import * as React from 'react';
import { isDeepEqual } from '@mui/x-internals/isDeepEqual';
import { useGridEvent as addEventHandler, useGridApiMethod, GRID_ROOT_GROUP_ID, useGridEvent, gridRowTreeSelector, } from '@mui/x-data-grid-pro';
import { useGridDataSourceBasePro, useGridRegisterStrategyProcessor, useGridRegisterPipeProcessor, gridPivotInitialColumnsSelector, runIf, gridPivotActiveSelector, GridStrategyGroup, DataSourceRowsUpdateStrategy, getGroupKeys, } from '@mui/x-data-grid-pro/internals';
import { gridPivotModelSelector } from '../pivoting/gridPivotingSelectors';
import { getPropsOverrides, fetchParents } from './utils';
import { gridRowGroupingSanitizedModelSelector } from '../rowGrouping/gridRowGroupingSelector';
import { gridAggregationModelSelector } from '../aggregation/gridAggregationSelectors';
function getKeyPremium(params) {
    return JSON.stringify([
        params.filterModel,
        params.sortModel,
        params.groupKeys,
        params.groupFields,
        params.start,
        params.end,
        params.pivotModel ? {} : params.aggregationModel,
        params.pivotModel,
    ]);
}
const options = {
    cacheOptions: {
        getKey: getKeyPremium,
    },
};
export const useGridDataSourcePremium = (apiRef, props) => {
    const aggregationModel = gridAggregationModelSelector(apiRef);
    const groupingModelSize = gridRowGroupingSanitizedModelSelector(apiRef).length;
    const setStrategyAvailability = React.useCallback(() => {
        const currentStrategy = props.treeData || (!props.disableRowGrouping && groupingModelSize > 0)
            ? DataSourceRowsUpdateStrategy.GroupedData
            : DataSourceRowsUpdateStrategy.Default;
        const prevStrategy = currentStrategy === DataSourceRowsUpdateStrategy.GroupedData
            ? DataSourceRowsUpdateStrategy.Default
            : DataSourceRowsUpdateStrategy.GroupedData;
        apiRef.current.setStrategyAvailability(GridStrategyGroup.DataSource, prevStrategy, () => false);
        apiRef.current.setStrategyAvailability(GridStrategyGroup.DataSource, currentStrategy, props.dataSource && !props.lazyLoading ? () => true : () => false);
    }, [
        apiRef,
        props.dataSource,
        props.lazyLoading,
        props.treeData,
        props.disableRowGrouping,
        groupingModelSize,
    ]);
    const handleEditRowWithAggregation = React.useCallback((params, updatedRow) => {
        const rowTree = gridRowTreeSelector(apiRef);
        if (updatedRow && !isDeepEqual(updatedRow, params.previousRow)) {
            // Reset the outdated cache, only if the row is _actually_ updated
            apiRef.current.dataSource.cache.clear();
        }
        const groupKeys = getGroupKeys(rowTree, params.rowId);
        apiRef.current.updateNestedRows([updatedRow], groupKeys);
        // To refresh the aggregation values of all parent rows and the footer row, recursively re-fetch all parent levels
        fetchParents(rowTree, params.rowId, apiRef.current.dataSource.fetchRows);
    }, [apiRef]);
    const { api, debouncedFetchRows, flatTreeStrategyProcessor, groupedDataStrategyProcessor, events, } = useGridDataSourceBasePro(apiRef, props, {
        ...(!props.disableAggregation && Object.keys(aggregationModel).length > 0
            ? { handleEditRow: handleEditRowWithAggregation }
            : {}),
        ...options,
    });
    const aggregateRowRef = React.useRef({});
    const initialColumns = gridPivotInitialColumnsSelector(apiRef);
    const pivotActive = gridPivotActiveSelector(apiRef);
    const pivotModel = gridPivotModelSelector(apiRef);
    const processDataSourceRows = React.useCallback(({ params, response, }, applyRowHydration) => {
        if (response.aggregateRow) {
            aggregateRowRef.current = response.aggregateRow;
        }
        if (Object.keys(params.aggregationModel || {}).length > 0) {
            if (applyRowHydration) {
                apiRef.current.requestPipeProcessorsApplication('hydrateRows');
            }
            apiRef.current.applyAggregation();
        }
        if (response.pivotColumns) {
            const pivotingColDef = props.pivotingColDef;
            if (!pivotingColDef || typeof pivotingColDef !== 'function') {
                throw new Error(`MUI X: No \`pivotingColDef()\` prop provided with to the Data Grid, but response contains \`pivotColumns\`.

You need a callback to return at least a field column prop for each generated pivot column.

See [server-side pivoting](https://mui.com/x/react-data-grid/server-side-data/pivoting/) documentation for more details.`);
            }
            // Update the grid state with new columns and column grouping model
            const partialPropsOverrides = getPropsOverrides(response.pivotColumns, pivotingColDef, pivotModel, initialColumns, apiRef);
            apiRef.current.setState((state) => {
                return {
                    ...state,
                    pivoting: {
                        ...state.pivoting,
                        propsOverrides: {
                            ...state.pivoting.propsOverrides,
                            ...partialPropsOverrides,
                        },
                    },
                };
            });
        }
        return {
            params,
            response,
        };
    }, [apiRef, props.pivotingColDef, initialColumns, pivotModel]);
    const resolveGroupAggregation = React.useCallback((groupId, field) => {
        if (groupId === GRID_ROOT_GROUP_ID) {
            return props.dataSource?.getAggregatedValue?.(aggregateRowRef.current, field);
        }
        const row = apiRef.current.getRow(groupId);
        return props.dataSource?.getAggregatedValue?.(row, field);
    }, [apiRef, props.dataSource]);
    const privateApi = {
        ...api.private,
        resolveGroupAggregation,
    };
    useGridApiMethod(apiRef, api.public, 'public');
    useGridApiMethod(apiRef, privateApi, 'private');
    useGridRegisterStrategyProcessor(apiRef, flatTreeStrategyProcessor.strategyName, flatTreeStrategyProcessor.group, flatTreeStrategyProcessor.processor);
    useGridRegisterStrategyProcessor(apiRef, groupedDataStrategyProcessor.strategyName, groupedDataStrategyProcessor.group, groupedDataStrategyProcessor.processor);
    useGridRegisterPipeProcessor(apiRef, 'processDataSourceRows', processDataSourceRows);
    Object.entries(events).forEach(([event, handler]) => {
        addEventHandler(apiRef, event, handler);
    });
    useGridEvent(apiRef, 'rowGroupingModelChange', runIf(!pivotActive, () => debouncedFetchRows()));
    useGridEvent(apiRef, 'aggregationModelChange', runIf(!pivotActive, () => debouncedFetchRows()));
    useGridEvent(apiRef, 'pivotModeChange', runIf(!pivotActive, () => debouncedFetchRows()));
    useGridEvent(apiRef, 'pivotModelChange', runIf(pivotActive, () => debouncedFetchRows()));
    React.useEffect(() => {
        setStrategyAvailability();
    }, [setStrategyAvailability]);
};
