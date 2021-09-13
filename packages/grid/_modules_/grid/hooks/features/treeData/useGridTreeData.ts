import * as React from 'react';
import { GridTreeDataApi } from './GridTreeDataApi';
import { GridRowId, GridRowModel, GridRowTree } from '../../../models/gridRows';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridRowsLookup } from '../rows/gridRowsSelector';
import { useGridApiMethod } from '../../root/useGridApiMethod';

const insertRowInTree = (tree: GridRowTree, id: GridRowId, row: GridRowModel, path: string[]) => {
  if (path.length === 0) {
    throw new Error(`Material-UI: Could not insert row #${id} in the tree structure.`);
  }

  if (path.length === 1) {
    tree[path[0]] = {
      node: row,
      children: {},
    };
  } else {
    const [nodeName, ...restPath] = path;

    if (!tree.hasOwnProperty(nodeName)) {
      throw new Error(`Material-UI: Could not insert row #${id} in the tree structure.`);
    }

    insertRowInTree(tree[nodeName].children, id, row, restPath);
  }
};

/**
 * Only available in DataGridPro
 */
export const useGridTreeData = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'getTreeDataPath'>,
) => {
  const groupRows = React.useCallback(
    (rowsLookup: GridRowsLookup) => {
      if (!props.getTreeDataPath) {
        throw new Error(
          'Material-UI: getTreeDataPath should always be defined when calling apiRef.current.groupRows.',
        );
      }

      const rows = Object.entries(rowsLookup)
        .map(([rowId, row]) => ({
          node: row,
          id: rowId,
          path: props.getTreeDataPath!(apiRef.current.getRowParams(rowId)),
        }))
        .sort((a, b) => a.path.length - b.path.length);

      const tree = {};
      rows.forEach((row) => {
        insertRowInTree(tree, row.id, row.node, row.path);
      });

      return tree;
    },
    [apiRef, props.getTreeDataPath],
  );

  const treeDataApi: GridTreeDataApi = {
    groupRows,
  };

  useGridApiMethod(apiRef, treeDataApi, 'GridTreeDataApi');
};
