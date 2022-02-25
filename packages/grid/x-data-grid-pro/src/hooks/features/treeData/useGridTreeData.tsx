import * as React from 'react';
import {
  useGridApiEventHandler,
  GridEventListener,
  GridEvents,
  gridRowIdsSelector,
  gridRowTreeSelector,
  gridFilteredDescendantCountLookupSelector,
  useFirstRender,
} from '@mui/x-data-grid';
import {
  GridSortingMethod,
  useGridRegisterSortingMethod,
  GridFilteringMethod,
  useGridRegisterFilteringMethod,
  GridRowGroupingPreProcessing,
} from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { buildRowTree, BuildRowTreeGroupingCriteria } from '../../../utils/tree/buildRowTree';
import { sortRowTree } from '../../../utils/tree/sortRowTree';
import { filterRowTreeFromTreeData } from './gridTreeDataUtils';

export const TREE_DATA_GROUPING_NAME = 'tree-data';

/**
 * Only available in DataGridPro
 * @requires useGridPreProcessing (method)
 * @requires useGridRowGroupsPreProcessing (method)
 */
export const useGridTreeData = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<
    DataGridProProcessedProps,
    | 'treeData'
    | 'getTreeDataPath'
    | 'groupingColDef'
    | 'defaultGroupingExpansionDepth'
    | 'isGroupExpandedByDefault'
    | 'disableChildrenFiltering'
    | 'disableChildrenSorting'
  >,
) => {
  /**
   * ROW GROUPING
   */
  const updateRowGrouping = React.useCallback(() => {
    if (!props.treeData) {
      return apiRef.current.unstable_registerRowGroupsBuilder('treeData', null);
    }

    const groupRows: GridRowGroupingPreProcessing = (params) => {
      if (!props.getTreeDataPath) {
        throw new Error('MUI: No getTreeDataPath given.');
      }

      const rows = params.ids
        .map((rowId) => ({
          id: rowId,
          path: props.getTreeDataPath!(params.idRowsLookup[rowId]).map(
            (key): BuildRowTreeGroupingCriteria => ({ key, field: null }),
          ),
        }))
        .sort((a, b) => a.path.length - b.path.length);

      return buildRowTree({
        rows,
        ...params,
        defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        isGroupExpandedByDefault: props.isGroupExpandedByDefault,
        groupingName: TREE_DATA_GROUPING_NAME,
        onDuplicatePath: (firstId, secondId, path) => {
          throw new Error(
            [
              'MUI: The path returned by `getTreeDataPath` should be unique.',
              `The rows with id #${firstId} and #${secondId} have the same.`,
              `Path: ${JSON.stringify(path.map((step) => step.key))}.`,
            ].join('\n'),
          );
        },
      });
    };

    return apiRef.current.unstable_registerRowGroupsBuilder('treeData', groupRows);
  }, [
    apiRef,
    props.getTreeDataPath,
    props.treeData,
    props.defaultGroupingExpansionDepth,
    props.isGroupExpandedByDefault,
  ]);

  useFirstRender(() => {
    updateRowGrouping();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    updateRowGrouping();
  }, [updateRowGrouping]);

  /**
   * PRE-PROCESSING
   */

  const filteringMethod = React.useCallback<GridFilteringMethod>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);

      return filterRowTreeFromTreeData({
        rowTree,
        isRowMatchingFilters: params.isRowMatchingFilters,
        disableChildrenFiltering: props.disableChildrenFiltering,
      });
    },
    [apiRef, props.disableChildrenFiltering],
  );

  const sortingMethod = React.useCallback<GridSortingMethod>(
    (params) => {
      const rowTree = gridRowTreeSelector(apiRef);
      const rowIds = gridRowIdsSelector(apiRef);

      return sortRowTree({
        rowTree,
        rowIds,
        sortRowList: params.sortRowList,
        disableChildrenSorting: props.disableChildrenSorting,
      });
    },
    [apiRef, props.disableChildrenSorting],
  );

  useGridRegisterFilteringMethod(apiRef, TREE_DATA_GROUPING_NAME, filteringMethod);
  useGridRegisterSortingMethod(apiRef, TREE_DATA_GROUPING_NAME, sortingMethod);

  /**
   * EVENTS
   */
  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (cellParams.colDef.type === 'treeDataGroup' && event.key === ' ' && !event.shiftKey) {
        event.stopPropagation();
        event.preventDefault();

        const filteredDescendantCount =
          gridFilteredDescendantCountLookupSelector(apiRef)[params.id] ?? 0;

        if (filteredDescendantCount === 0) {
          return;
        }

        apiRef.current.setRowChildrenExpansion(params.id, !params.rowNode.childrenExpanded);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};
