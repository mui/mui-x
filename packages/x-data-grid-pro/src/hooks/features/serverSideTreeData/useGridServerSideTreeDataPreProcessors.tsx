import * as React from 'react';
import {
  gridRowTreeSelector,
  useFirstRender,
  GridColDef,
  GridRenderCellParams,
  GridServerSideGroupNode,
  GridRowId,
  GRID_CHECKBOX_SELECTION_FIELD,
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
} from '../treeData/gridTreeDataGroupColDef';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { skipFiltering } from './utils';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import {
  GridGroupingColDefOverride,
  GridGroupingColDefOverrideParams,
} from '../../../models/gridGroupingColDefOverride';
import { GridServerSideTreeDataGroupingCell } from '../../../components/GridServerSideTreeDataGroupingCell';
import { createRowTree } from '../../../utils/tree/createRowTree';
import {
  GridTreePathDuplicateHandler,
  RowTreeBuilderGroupingCriterion,
} from '../../../utils/tree/models';
import { sortRowTree } from '../../../utils/tree/sortRowTree';
import { updateRowTree } from '../../../utils/tree/updateRowTree';
import { getVisibleRowsLookup } from '../../../utils/tree/utils';

const SERVER_SIDE_TREE_DATA_STRATEGY = 'serverSideTreeData';

export const useGridServerSideTreeDataPreProcessors = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'treeData'
    | 'groupingColDef'
    | 'getGroupKey'
    | 'disableChildrenSorting'
    | 'disableChildrenFiltering'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'unstable_dataSource'
    | 'hasChildren'
  >,
) => {
  const setStrategyAvailability = React.useCallback(() => {
    privateApiRef.current.setStrategyAvailability(
      'rowTree',
      SERVER_SIDE_TREE_DATA_STRATEGY,
      props.treeData && props.unstable_dataSource ? () => true : () => false,
    );
  }, [privateApiRef, props.treeData, props.unstable_dataSource]);

  const getGroupingColDef = React.useCallback(() => {
    const groupingColDefProp = props.groupingColDef;

    let colDefOverride: GridGroupingColDefOverride | null | undefined;
    if (typeof groupingColDefProp === 'function') {
      const params: GridGroupingColDefOverrideParams = {
        groupingName: SERVER_SIDE_TREE_DATA_STRATEGY,
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
        <GridServerSideTreeDataGroupingCell
          {...(params as GridRenderCellParams<any, any, any, GridServerSideGroupNode>)}
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
      if (!props.getGroupKey) {
        throw new Error('MUI X: No `getGroupKey` prop provided.');
      }

      if (!props.hasChildren) {
        throw new Error('MUI X: No `hasChildren` prop provided.');
      }

      const parentPath = privateApiRef.current.caches.groupKeys || [];

      const getRowTreeBuilderNode = (rowId: GridRowId) => ({
        id: rowId,
        path: [...parentPath, props.getGroupKey!(params.dataRowIdToModelLookup[rowId])].map(
          (key): RowTreeBuilderGroupingCriterion => ({ key, field: null }),
        ),
        hasServerChildren: props.hasChildren!(params.dataRowIdToModelLookup[rowId]),
      });

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
          defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
          isGroupExpandedByDefault: props.isGroupExpandedByDefault,
          groupingName: SERVER_SIDE_TREE_DATA_STRATEGY,
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
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: SERVER_SIDE_TREE_DATA_STRATEGY,
      });
    },
    [
      props.getGroupKey,
      props.hasChildren,
      props.defaultGroupingExpansionDepth,
      props.isGroupExpandedByDefault,
      privateApiRef,
    ],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(() => {
    const rowTree = gridRowTreeSelector(privateApiRef);

    return skipFiltering({
      rowTree,
    });
  }, [privateApiRef]);

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

  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', updateGroupingColumn);
  useGridRegisterStrategyProcessor(
    privateApiRef,
    SERVER_SIDE_TREE_DATA_STRATEGY,
    'rowTreeCreation',
    createRowTreeForTreeData,
  );
  useGridRegisterStrategyProcessor(
    privateApiRef,
    SERVER_SIDE_TREE_DATA_STRATEGY,
    'filtering',
    filterRows,
  );
  useGridRegisterStrategyProcessor(
    privateApiRef,
    SERVER_SIDE_TREE_DATA_STRATEGY,
    'sorting',
    sortRows,
  );
  useGridRegisterStrategyProcessor(
    privateApiRef,
    SERVER_SIDE_TREE_DATA_STRATEGY,
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
