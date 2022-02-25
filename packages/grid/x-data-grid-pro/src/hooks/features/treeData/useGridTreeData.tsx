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
  GridStrategyProcessor,
  useGridRegisterStrategyProcessor,
} from '@mui/x-data-grid/internals';
import { GridApiPro } from '../../../models/gridApiPro';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import { buildRowTree, BuildRowTreeGroupingCriteria } from '../../../utils/tree/buildRowTree';
import { sortRowTree } from '../../../utils/tree/sortRowTree';
import { filterRowTreeFromTreeData, TREE_DATA_FEATURE_NAME } from './gridTreeDataUtils';

/**
 * Only available in DataGridPro
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
  const setStrategyAvailability = React.useCallback(() => {
    apiRef.current.unstable_setStrategyAvailability(TREE_DATA_FEATURE_NAME, props.treeData);
  }, [apiRef, props.treeData]);

  /**
   * PRE-PROCESSING
   */
  const createRowTree = React.useCallback<GridStrategyProcessor<'rowTreeCreation'>>(
    (params) => {
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
        groupingName: TREE_DATA_FEATURE_NAME,
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
    },
    [props.getTreeDataPath, props.defaultGroupingExpansionDepth, props.isGroupExpandedByDefault],
  );

  const filterRows = React.useCallback<GridStrategyProcessor<'filtering'>>(
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

  const sortRows = React.useCallback<GridStrategyProcessor<'sorting'>>(
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

  useGridRegisterStrategyProcessor(
    apiRef,
    'rowTreeCreation',
    TREE_DATA_FEATURE_NAME,
    createRowTree,
  );
  useGridRegisterStrategyProcessor(apiRef, 'filtering', TREE_DATA_FEATURE_NAME, filterRows);
  useGridRegisterStrategyProcessor(apiRef, 'sorting', TREE_DATA_FEATURE_NAME, sortRows);

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
