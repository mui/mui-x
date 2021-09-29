import * as React from 'react';
import { GridTreeDataApi } from './gridTreeDataApi';
import {
  GridRowData,
  GridRowId,
  GridRowIdGetter,
  GridRowConfigTree,
  GridRowConfigTreeNode,
} from '../../../models/gridRows';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { GridColumnsPreProcessing } from '../../root/columnsPreProcessing';
import { GridTreeDataGroupColDef } from './gridTreeDataGroupColDef';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridEvents } from '../../../constants';
import { GridCellParams, GridColDef, MuiEvent } from '../../../models';
import { isSpaceKey } from '../../../utils/keyboardUtils';
import { useFirstRender } from '../../utils/useFirstRender';

const insertRowInTree = (
  tree: GridRowConfigTree,
  id: GridRowId,
  path: string[],
  depth: number = 0,
) => {
  if (path.length === 0) {
    throw new Error(`MUI: Could not insert row #${id} in the tree structure.`);
  }

  if (path.length === 1) {
    tree.set(path[0], {
      id,
      depth,
    });
  } else {
    const [nodeName, ...restPath] = path;

    const parent = tree.get(nodeName);
    if (!parent) {
      throw new Error(`MUI: Could not insert row #${id} in the tree structure.`);
    }

    if (!parent.children) {
      parent.children = new Map<string, GridRowConfigTreeNode>();
    }

    insertRowInTree(parent.children, id, restPath, depth + 1);
  }
};

// TODO: Remove, it is only here to avoid casting the ID when using the lookup key
function getGridRowId(rowData: GridRowData, getRowId?: GridRowIdGetter): GridRowId {
  return getRowId ? getRowId(rowData) : rowData.id;
}

/**
 * Only available in DataGridPro
 */
export const useGridTreeData = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'treeData' | 'getTreeDataPath' | 'getRowId' | 'groupingColDef' | 'rows'
  >,
) => {
  const groupRows = React.useCallback<GridTreeDataApi['groupRows']>(
    (rowsLookup, rowIds) => {
      if (!props.treeData) {
        return {
          tree: new Map<string, GridRowConfigTreeNode>(
            rowIds.map((id) => [id.toString(), { id, depth: 0 }]),
          ),
          paths: Object.fromEntries(rowIds.map((id) => [id, [id.toString()]])),
        };
      }

      if (!props.getTreeDataPath) {
        // return { tree: new Map(), paths: {} }
        throw new Error('MUI: No getTreeDataPath given.');
      }

      const rows = Object.values(rowsLookup)
        .map((row) => {
          const id = getGridRowId(row, props.getRowId);

          return {
            id,
            path: props.getTreeDataPath!(row),
          };
        })
        .sort((a, b) => a.path.length - b.path.length);

      const paths = Object.fromEntries(rows.map((row) => [row.id, row.path]));
      const tree = new Map<string, GridRowConfigTreeNode>();
      rows.forEach((row) => {
        insertRowInTree(tree, row.id, row.path);
      });

      return {
        tree,
        paths,
      };
    },
    [props.getTreeDataPath, props.getRowId, props.treeData],
  );

  const treeDataApi: GridTreeDataApi = {
    groupRows,
  };

  useGridApiMethod(apiRef, treeDataApi, 'GridTreeDataApi');

  const updateColumnsPreProcessing = React.useCallback(() => {
    if (!props.treeData) {
      apiRef.current.registerColumnPreProcessing('treeData', null);
    } else {
      const addGroupingColumn: GridColumnsPreProcessing = (columns) => {
        const index = columns[0].type === 'checkboxSelection' ? 1 : 0;
        const groupingColumn: GridColDef = {
          ...GridTreeDataGroupColDef,
          headerName: apiRef.current.getLocaleText('treeDataGroupingHeaderName'),
          ...props.groupingColDef,
        };

        return [...columns.slice(0, index), groupingColumn, ...columns.slice(index)];
      };

      apiRef.current.registerColumnPreProcessing('treeData', addGroupingColumn);
    }
  }, [apiRef, props.treeData, props.groupingColDef]);

  useFirstRender(() => {
    updateColumnsPreProcessing();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    updateColumnsPreProcessing();
  }, [updateColumnsPreProcessing]);

  // The treeData options have changed, we want to regenerate the tree
  // We do not want to run that update on the first render
  // TODO: This update is throttle is throttleRowsMs is defined, it should not
  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    apiRef.current.setRows([...props.rows]);
  }, [apiRef, props.treeData, props.getTreeDataPath]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCellKeyDown = React.useCallback(
    (params: GridCellParams, event: MuiEvent<React.KeyboardEvent>) => {
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      if (cellParams.field === '__tree_data_group__' && isSpaceKey(event.key)) {
        event.stopPropagation();
        apiRef.current.setRowExpansion(params.id, !apiRef.current.getRowNode(params.id)?.expanded);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};
