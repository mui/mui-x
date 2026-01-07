'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  gridRowTreeSelector,
  useFirstRender,
  GridColDef,
  GridRenderCellParams,
  GridGroupNode,
  GridRowId,
} from '@mui/x-data-grid';
import {
  GridPipeProcessor,
  GridStrategyGroup,
  GridStrategyProcessor,
  useGridRegisterPipeProcessor,
  useGridRegisterStrategyProcessor,
} from '@mui/x-data-grid/internals';
import {
  GRID_TREE_DATA_GROUPING_COL_DEF,
  GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
} from './gridTreeDataGroupColDef';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { filterRowTreeFromTreeData, TreeDataStrategy } from './gridTreeDataUtils';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import {
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from '../../../models/gridGroupingColDefOverride';
import { GridTreeDataGroupingCell } from '../../../components';
import { createRowTree } from '../../../utils/tree/createRowTree';
import {
  GridTreePathDuplicateHandler,
  RowTreeBuilderGroupingCriterion,
} from '../../../utils/tree/models';
import { sortRowTree } from '../../../utils/tree/sortRowTree';
import { updateRowTree } from '../../../utils/tree/updateRowTree';
import { getVisibleRowsLookup } from '../../../utils/tree/utils';

export const useGridTreeDataPreProcessors = (
  privateApiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'treeData'
    | 'groupingColDef'
    | 'getTreeDataPath'
    | 'disableChildrenSorting'
    | 'disableChildrenFiltering'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'dataSource'
  >,
) => {
  const {
    treeData,
    groupingColDef,
    getTreeDataPath,
    disableChildrenSorting,
    disableChildrenFiltering,
    defaultGroupingExpansionDepth,
    isGroupExpandedByDefault,
    dataSource,
  } = props;

  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability(
      GridStrategyGroup.RowTree,
      TreeDataStrategy.Default,
      treeData && !dataSource ? () => true : () => false,
    );
  }, [privateApiRef, treeData, dataSource]);

  const getGroupingColDef = React.useCallback(() => {
    let colDefOverride: GridGroupingColDefOverride | null | undefined;
    if (typeof groupingColDef === 'function') {
      const params: GridGroupingColDefOverrideParams = {
        groupingName: TreeDataStrategy.Default,
        fields: [],
      };

      colDefOverride = groupingColDef(params);
    } else {
      colDefOverride = groupingColDef;
    }

    const { hideDescendantCount, ...colDefOverrideProperties } = colDefOverride ?? {};

    const commonProperties: Omit<GridColDef, 'field' | 'editable'> = {
      ...GRID_TREE_DATA_GROUPING_COL_DEF,
      renderCell: (params) => (
        <GridTreeDataGroupingCell
          {...(params as GridRenderCellParams<any, any, any, GridGroupNode>)}
          hideDescendantCount={hideDescendantCount}
        />
      ),
      headerName: privateApiRef.current.getLocaleText('treeDataGroupingHeaderName'),
    };

    return {
      ...commonProperties,
      ...colDefOverrideProperties,
      ...GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
    };
  }, [privateApiRef, groupingColDef]);

  const updateGroupingColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      if (dataSource) {
        return columnsState;
      }
      const groupingColDefField = GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES.field;

      const shouldHaveGroupingColumn = treeData;
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
      } else if (!shouldHaveGroupingColumn && prevGroupingColumn) {
        delete columnsState.lookup[groupingColDefField];
        columnsState.orderedFields = columnsState.orderedFields.filter(
          (field) => field !== groupingColDefField,
        );
      }

      return columnsState;
    },
    [treeData, dataSource, getGroupingColDef],
  );

  const createRowTreeForTreeData = React.useCallback<GridStrategyProcessor<'rowTreeCreation'>>(
    (params) => {
      if (!getTreeDataPath) {
        throw new Error('MUI X: No getTreeDataPath given.');
      }

      const getRowTreeBuilderNode = (rowId: GridRowId) => ({
        id: rowId,
        path: getTreeDataPath!(params.dataRowIdToModelLookup[rowId]).map(
          (key): RowTreeBuilderGroupingCriterion => ({ key, field: null }),
        ),
      });

      const onDuplicatePath: GridTreePathDuplicateHandler = (firstId, secondId, path) => {
        throw new Error(
          [
            'MUI X: The path returned by `getTreeDataPath` should be unique.',
            `The rows with id #${firstId} and #${secondId} have the same.`,
            `Path: ${JSON.stringify(path.map((step) => step.key))}.`,
          ].join('\n'),
        );
      };

      if (params.updates.type === 'full') {
        return createRowTree({
          previousTree: params.previousTree,
          nodes: params.updates.rows.map(getRowTreeBuilderNode),
          defaultGroupingExpansionDepth,
          isGroupExpandedByDefault,
          groupingName: TreeDataStrategy.Default,
          onDuplicatePath,
        });
      }

      return updateRowTree({
        nodes: {
          inserted: params.updates.actions.insert.map(getRowTreeBuilderNode),
          modified: params.updates.actions.modify.map(getRowTreeBuilderNode),
          removed: params.updates.actions.remove,
        },
        previousTree: params.previousTree!,
        previousTreeDepth: params.previousTreeDepths!,
        defaultGroupingExpansionDepth,
        isGroupExpandedByDefault,
        groupingName: TreeDataStrategy.Default,
      });
    },
    [getTreeDataPath, defaultGroupingExpansionDepth, isGroupExpandedByDefault],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(privateApiRef);

      return filterRowTreeFromTreeData({
        rowTree,
        isRowMatchingFilters: params.isRowMatchingFilters,
        disableChildrenFiltering,
        filterModel: params.filterModel,
        filterValueGetter: params.filterValueGetter,
        apiRef: privateApiRef,
      });
    },
    [privateApiRef, disableChildrenFiltering],
  );

  const sortRows = React.useCallback<GridStrategyProcessor<'sorting'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(privateApiRef);

      return sortRowTree({
        rowTree,
        sortRowList: params.sortRowList,
        disableChildrenSorting,
        shouldRenderGroupBelowLeaves: false,
      });
    },
    [privateApiRef, disableChildrenSorting],
  );

  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterStrategyProcessor(
    privateApiRef,
    TreeDataStrategy.Default,
    'rowTreeCreation',
    createRowTreeForTreeData,
  );
  useGridRegisterStrategyProcessor(
    privateApiRef,
    TreeDataStrategy.Default,
    'filtering',
    filterRows,
  );
  useGridRegisterStrategyProcessor(privateApiRef, TreeDataStrategy.Default, 'sorting', sortRows);
  useGridRegisterStrategyProcessor(
    privateApiRef,
    TreeDataStrategy.Default,
    'visibleRowsLookupCreation',
    getVisibleRowsLookup,
  );

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
    } else {
      isFirstRender.current = false;
    }
  }, [setStrategyAvailability]);
};
