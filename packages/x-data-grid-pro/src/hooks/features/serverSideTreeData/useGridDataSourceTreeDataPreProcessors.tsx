'use client';
import * as React from 'react';
import { RefObject } from '@mui/x-internals/types';
import {
  gridRowTreeSelector,
  useFirstRender,
  GridColDef,
  GridRenderCellParams,
  GridDataSourceGroupNode,
  GridRowId,
} from '@mui/x-data-grid';
import {
  GridPipeProcessor,
  GridRowsPartialUpdates,
  GridStrategyGroup,
  GridStrategyProcessor,
  useGridRegisterPipeProcessor,
  useGridRegisterStrategyProcessor,
} from '@mui/x-data-grid/internals';
import {
  GRID_TREE_DATA_GROUPING_COL_DEF,
  GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
} from '../treeData/gridTreeDataGroupColDef';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { getParentPath, skipFiltering, skipSorting } from './utils';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import {
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from '../../../models/gridGroupingColDefOverride';
import { GridDataSourceTreeDataGroupingCell } from '../../../components/GridDataSourceTreeDataGroupingCell';
import { createRowTree } from '../../../utils/tree/createRowTree';
import {
  GridTreePathDuplicateHandler,
  RowTreeBuilderGroupingCriterion,
} from '../../../utils/tree/models';
import { updateRowTree } from '../../../utils/tree/updateRowTree';
import { getVisibleRowsLookup } from '../../../utils/tree/utils';
import { TreeDataStrategy } from '../treeData/gridTreeDataUtils';

export const useGridDataSourceTreeDataPreProcessors = (
  privateApiRef: RefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'treeData'
    | 'groupingColDef'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'dataSource'
  >,
) => {
  const {
    treeData,
    groupingColDef,
    defaultGroupingExpansionDepth,
    isGroupExpandedByDefault,
    dataSource,
  } = props;

  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability(
      GridStrategyGroup.RowTree,
      TreeDataStrategy.DataSource,
      treeData && dataSource ? () => true : () => false,
    );
  }, [privateApiRef, treeData, dataSource]);

  const getGroupingColDef = React.useCallback(() => {
    let colDefOverride: GridGroupingColDefOverride | null | undefined;
    if (typeof groupingColDef === 'function') {
      const params: GridGroupingColDefOverrideParams = {
        groupingName: TreeDataStrategy.DataSource,
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
        <GridDataSourceTreeDataGroupingCell
          {...(params as GridRenderCellParams<any, any, any, GridDataSourceGroupNode>)}
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
      if (!dataSource) {
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
      const getGroupKey = dataSource?.getGroupKey;
      if (!getGroupKey) {
        throw new Error('MUI X: No `getGroupKey` method provided with the dataSource.');
      }

      const getChildrenCount = dataSource?.getChildrenCount;
      if (!getChildrenCount) {
        throw new Error('MUI X: No `getChildrenCount` method provided with the dataSource.');
      }

      const getRowTreeBuilderNode = (rowId: GridRowId) => {
        const parentPath =
          (params.updates as GridRowsPartialUpdates).groupKeys ?? getParentPath(rowId, params);
        const count = getChildrenCount(params.dataRowIdToModelLookup[rowId]);
        return {
          id: rowId,
          path: [...parentPath, getGroupKey(params.dataRowIdToModelLookup[rowId])].map(
            (key): RowTreeBuilderGroupingCriterion => ({ key, field: null }),
          ),
          serverChildrenCount: count,
        };
      };

      const onDuplicatePath: GridTreePathDuplicateHandler = (firstId, secondId, path) => {
        throw new Error(
          [
            'MUI X: The values returned by `getGroupKey` for all the sibling rows should be unique.',
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
        previousTree: params.previousTree!,
        previousGroupsToFetch: params.previousGroupsToFetch,
        previousTreeDepth: params.previousTreeDepths!,
        defaultGroupingExpansionDepth,
        isGroupExpandedByDefault,
        groupingName: TreeDataStrategy.DataSource,
      });
    },
    [dataSource, defaultGroupingExpansionDepth, isGroupExpandedByDefault],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(() => {
    const rowTree = gridRowTreeSelector(privateApiRef);

    return skipFiltering(rowTree);
  }, [privateApiRef]);

  const sortRows = React.useCallback<GridStrategyProcessor<'sorting'>>(() => {
    const rowTree = gridRowTreeSelector(privateApiRef);

    return skipSorting(rowTree);
  }, [privateApiRef]);

  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterStrategyProcessor(
    privateApiRef,
    TreeDataStrategy.DataSource,
    'rowTreeCreation',
    createRowTreeForTreeData,
  );
  useGridRegisterStrategyProcessor(
    privateApiRef,
    TreeDataStrategy.DataSource,
    'filtering',
    filterRows,
  );
  useGridRegisterStrategyProcessor(privateApiRef, TreeDataStrategy.DataSource, 'sorting', sortRows);
  useGridRegisterStrategyProcessor(
    privateApiRef,
    TreeDataStrategy.DataSource,
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
