'use client';
import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { gridRowTreeSelector, useFirstRender, } from '@mui/x-data-grid';
import { GridStrategyGroup, useGridRegisterPipeProcessor, useGridRegisterStrategyProcessor, } from '@mui/x-data-grid/internals';
import { GRID_TREE_DATA_GROUPING_COL_DEF, GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES, } from '../treeData/gridTreeDataGroupColDef';
import { getParentPath, skipFiltering, skipSorting } from './utils';
import { GridDataSourceTreeDataGroupingCell } from '../../../components/GridDataSourceTreeDataGroupingCell';
import { createRowTree } from '../../../utils/tree/createRowTree';
import { updateRowTree } from '../../../utils/tree/updateRowTree';
import { getVisibleRowsLookup } from '../../../utils/tree/utils';
import { TreeDataStrategy } from '../treeData/gridTreeDataUtils';
export const useGridDataSourceTreeDataPreProcessors = (privateApiRef, props) => {
    const setStrategyAvailability = React.useCallback(() => {
        privateApiRef.current.setStrategyAvailability(GridStrategyGroup.RowTree, TreeDataStrategy.DataSource, props.treeData && props.dataSource ? () => true : () => false);
    }, [privateApiRef, props.treeData, props.dataSource]);
    const getGroupingColDef = React.useCallback(() => {
        const groupingColDefProp = props.groupingColDef;
        let colDefOverride;
        if (typeof groupingColDefProp === 'function') {
            const params = {
                groupingName: TreeDataStrategy.DataSource,
                fields: [],
            };
            colDefOverride = groupingColDefProp(params);
        }
        else {
            colDefOverride = groupingColDefProp;
        }
        const { hideDescendantCount, ...colDefOverrideProperties } = colDefOverride ?? {};
        const commonProperties = {
            ...GRID_TREE_DATA_GROUPING_COL_DEF,
            renderCell: (params) => (_jsx(GridDataSourceTreeDataGroupingCell, { ...params, hideDescendantCount: hideDescendantCount })),
            headerName: privateApiRef.current.getLocaleText('treeDataGroupingHeaderName'),
        };
        return {
            ...commonProperties,
            ...colDefOverrideProperties,
            ...GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
        };
    }, [privateApiRef, props.groupingColDef]);
    const updateGroupingColumn = React.useCallback((columnsState) => {
        if (!props.dataSource) {
            return columnsState;
        }
        const groupingColDefField = GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES.field;
        const shouldHaveGroupingColumn = props.treeData;
        const prevGroupingColumn = columnsState.lookup[groupingColDefField];
        if (shouldHaveGroupingColumn) {
            const newGroupingColumn = getGroupingColDef();
            if (prevGroupingColumn) {
                newGroupingColumn.width = prevGroupingColumn.width;
                newGroupingColumn.flex = prevGroupingColumn.flex;
            }
            columnsState.lookup[groupingColDefField] = newGroupingColumn;
            if (prevGroupingColumn == null) {
                columnsState.orderedFields = [groupingColDefField, ...columnsState.orderedFields];
            }
        }
        else if (!shouldHaveGroupingColumn && prevGroupingColumn) {
            delete columnsState.lookup[groupingColDefField];
            columnsState.orderedFields = columnsState.orderedFields.filter((field) => field !== groupingColDefField);
        }
        return columnsState;
    }, [props.treeData, props.dataSource, getGroupingColDef]);
    const createRowTreeForTreeData = React.useCallback((params) => {
        const getGroupKey = props.dataSource?.getGroupKey;
        if (!getGroupKey) {
            throw new Error('MUI X Data Grid: No getGroupKey method provided with the dataSource. ' +
                'Server-side tree data requires a getGroupKey method to determine row hierarchy. ' +
                'Add getGroupKey to your dataSource configuration.');
        }
        const getChildrenCount = props.dataSource?.getChildrenCount;
        if (!getChildrenCount) {
            throw new Error('MUI X Data Grid: No getChildrenCount method provided with the dataSource. ' +
                'Server-side tree data requires a getChildrenCount method to determine expandable rows. ' +
                'Add getChildrenCount to your dataSource configuration.');
        }
        const getRowTreeBuilderNode = (rowId) => {
            const parentPath = params.updates.groupKeys ?? getParentPath(rowId, params);
            const count = getChildrenCount(params.dataRowIdToModelLookup[rowId]);
            return {
                id: rowId,
                path: [...parentPath, getGroupKey(params.dataRowIdToModelLookup[rowId])].map((key) => ({ key, field: null })),
                serverChildrenCount: count,
            };
        };
        const onDuplicatePath = (firstId, secondId, path) => {
            throw new Error(`MUI X Data Grid: The values returned by getGroupKey for sibling rows must be unique. ` +
                `Rows with id "${firstId}" and "${secondId}" have the same path: ${JSON.stringify(path.map((step) => step.key))}. ` +
                'Ensure getGroupKey returns unique values for each sibling row.');
        };
        if (params.updates.type === 'full') {
            return createRowTree({
                previousTree: params.previousTree,
                nodes: params.updates.rows.map(getRowTreeBuilderNode),
                defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
                isGroupExpandedByDefault: props.isGroupExpandedByDefault,
                groupingName: TreeDataStrategy.DataSource,
                onDuplicatePath,
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
            groupingName: TreeDataStrategy.DataSource,
        });
    }, [props.dataSource, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault]);
    const filterRows = React.useCallback(() => {
        const rowTree = gridRowTreeSelector(privateApiRef);
        return skipFiltering(rowTree);
    }, [privateApiRef]);
    const sortRows = React.useCallback(() => {
        const rowTree = gridRowTreeSelector(privateApiRef);
        return skipSorting(rowTree);
    }, [privateApiRef]);
    useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateGroupingColumn);
    useGridRegisterStrategyProcessor(privateApiRef, TreeDataStrategy.DataSource, 'rowTreeCreation', createRowTreeForTreeData);
    useGridRegisterStrategyProcessor(privateApiRef, TreeDataStrategy.DataSource, 'filtering', filterRows);
    useGridRegisterStrategyProcessor(privateApiRef, TreeDataStrategy.DataSource, 'sorting', sortRows);
    useGridRegisterStrategyProcessor(privateApiRef, TreeDataStrategy.DataSource, 'visibleRowsLookupCreation', getVisibleRowsLookup);
    /**
     * 1ST RENDER
     */
    useFirstRender(() => {
        setStrategyAvailability();
    });
    /**
     * EFFECTS
     */
    const isFirstRender = React.useRef(true);
    React.useEffect(() => {
        if (!isFirstRender.current) {
            setStrategyAvailability();
        }
        else {
            isFirstRender.current = false;
        }
    }, [setStrategyAvailability]);
};
