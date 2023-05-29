import * as React from 'react';
import {
  gridRowTreeSelector,
  useFirstRender,
  GridColDef,
  GridRenderCellParams,
  GridGroupNode,
  GridRowId,
  GRID_CHECKBOX_SELECTION_FIELD,
  GRID_ROOT_GROUP_ID,
  GridServerSideGroupNode,
} from '@mui/x-data-grid';
import {
  GridPipeProcessor,
  GridStrategyProcessor,
  useGridRegisterPipeProcessor,
  useGridRegisterStrategyProcessor,
} from '@mui/x-data-grid/internals';
import {
  GRID_TREE_DATA_GROUPING_COL_DEF,
  GRID_TREE_DATA_GROUPING_COL_DEF_FORCED_PROPERTIES,
} from './gridTreeDataGroupColDef';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  filterRowTreeFromTreeData,
  iterateTreeNodes,
  TREE_DATA_LAZY_LOADING_STRATEGY,
} from './gridTreeDataUtils';
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

export const useGridTreeDataLazyLoadingPreProcessors = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'treeData'
    | 'groupingColDef'
    | 'getTreeDataPath'
    | 'disableChildrenSorting'
    | 'disableChildrenFiltering'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'rowsLoadingMode'
    | 'isServerSideRow'
  >,
) => {
  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability(
      'rowTree',
      TREE_DATA_LAZY_LOADING_STRATEGY,
      props.treeData && props.rowsLoadingMode === 'server' ? () => true : () => false,
    );
  }, [privateApiRef, props.treeData, props.rowsLoadingMode]);

  const getGroupingColDef = React.useCallback(() => {
    const groupingColDefProp = props.groupingColDef;

    let colDefOverride: GridGroupingColDefOverride | null | undefined;
    if (typeof groupingColDefProp === 'function') {
      const params: GridGroupingColDefOverrideParams = {
        groupingName: TREE_DATA_LAZY_LOADING_STRATEGY,
        fields: [],
      };

      colDefOverride = groupingColDefProp(params);
    } else {
      colDefOverride = groupingColDefProp;
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
  }, [privateApiRef, props.groupingColDef]);

  const updateGroupingColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
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
          const index = columnsState.orderedFields[0] === GRID_CHECKBOX_SELECTION_FIELD ? 1 : 0;
          columnsState.orderedFields = [
            ...columnsState.orderedFields.slice(0, index),
            groupingColDefField,
            ...columnsState.orderedFields.slice(index),
          ];
        }
      } else if (!shouldHaveGroupingColumn && prevGroupingColumn) {
        delete columnsState.lookup[groupingColDefField];
        columnsState.orderedFields = columnsState.orderedFields.filter(
          (field) => field !== groupingColDefField,
        );
      }

      return columnsState;
    },
    [props.treeData, getGroupingColDef],
  );

  const createRowTreeForTreeData = React.useCallback<GridStrategyProcessor<'rowTreeCreation'>>(
    (params) => {
      if (!props.getTreeDataPath) {
        throw new Error('MUI: No getTreeDataPath given.');
      }

      const getRowTreeBuilderNode = (rowId: GridRowId) => ({
        id: rowId,
        path: props.getTreeDataPath!(params.dataRowIdToModelLookup[rowId]).map(
          (key): RowTreeBuilderGroupingCriterion => ({ key, field: null }),
        ),
      });

      const onDuplicatePath: GridTreePathDuplicateHandler = (firstId, secondId, path) => {
        throw new Error(
          [
            'MUI: The path returned by `getTreeDataPath` should be unique.',
            `The rows with id #${firstId} and #${secondId} have the same.`,
            `Path: ${JSON.stringify(path.map((step) => step.key))}.`,
          ].join('\n'),
        );
      };

      if (params.updates.type === 'full') {
        return createRowTree({
          previousTree: params.previousTree,
          nodes: params.updates.rows.map(getRowTreeBuilderNode),
          defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
          isGroupExpandedByDefault: props.isGroupExpandedByDefault,
          groupingName: TREE_DATA_LAZY_LOADING_STRATEGY,
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
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: TREE_DATA_LAZY_LOADING_STRATEGY,
      });
    },
    [props.getTreeDataPath, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(privateApiRef);

      return filterRowTreeFromTreeData({
        rowTree,
        isRowMatchingFilters: params.isRowMatchingFilters,
        disableChildrenFiltering: props.disableChildrenFiltering,
        filterModel: params.filterModel,
        apiRef: privateApiRef,
      });
    },
    [privateApiRef, props.disableChildrenFiltering],
  );

  const sortRows = React.useCallback<GridStrategyProcessor<'sorting'>>(
    (params) => {
      const rowTree = gridRowTreeSelector(privateApiRef);

      return sortRowTree({
        rowTree,
        sortRowList: params.sortRowList,
        disableChildrenSorting: props.disableChildrenSorting,
        shouldRenderGroupBelowLeaves: false,
      });
    },
    [privateApiRef, props.disableChildrenSorting],
  );

  const setServerSideGroups = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (params) => {
      // To investigate: Avoid dual processing, make this part of `rowTreeCreation` strategy processor
      if (Object.keys(params.tree).length === 1) {
        // TODO: Fix this hack
        (params.tree[GRID_ROOT_GROUP_ID] as GridServerSideGroupNode).isLoading = true;
        return params;
      }

      if (props.rowsLoadingMode !== 'server' || !props.isServerSideRow || !props.treeData) {
        return params;
      }

      iterateTreeNodes(
        params.dataRowIdToModelLookup,
        params.tree,
        GRID_ROOT_GROUP_ID,
        props.isServerSideRow,
      );

      return params;
    },
    [props.isServerSideRow, props.treeData, props.rowsLoadingMode],
  );

  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterPipeProcessor(privateApiRef, 'hydrateRows', setServerSideGroups);

  useGridRegisterStrategyProcessor(
    privateApiRef,
    TREE_DATA_LAZY_LOADING_STRATEGY,
    'rowTreeCreation',
    createRowTreeForTreeData,
  );
  useGridRegisterStrategyProcessor(
    privateApiRef,
    TREE_DATA_LAZY_LOADING_STRATEGY,
    'filtering',
    filterRows,
  );
  useGridRegisterStrategyProcessor(
    privateApiRef,
    TREE_DATA_LAZY_LOADING_STRATEGY,
    'sorting',
    sortRows,
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
