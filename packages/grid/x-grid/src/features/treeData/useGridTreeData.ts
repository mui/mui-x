import * as React from 'react';
import { useGridApiEventHandler } from '../../../../_modules_/grid/hooks/root/useGridApiEventHandler';
import {
  GridApiRef,
  GridComponentProps,
  GridEvents,
  GridRowId,
  GridRowModel,
  gridRowsLookupSelector,
} from '../../../../_modules_/grid';

interface TreeNode {
  node: GridRowModel;
  children: Tree;
}

type Tree = { [nodeName: string]: TreeNode };

interface RowWithPath {
  node: GridRowModel;
  id: GridRowId;
  path: string[];
}

const insertRowInTree = (tree: Tree, id: GridRowId, row: GridRowModel, path: string[]): Tree => {
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

    tree[nodeName].children = insertRowInTree(tree[nodeName].children, id, row, restPath);
  }

  return tree;
};

/**
 * Only available in DataGridPro
 */
export const useGridTreeData = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'treeData' | 'getTreeDataPath'>,
) => {
  const handleRowsSet = React.useCallback(() => {
    if (!props.treeData) {
      return;
    }

    if (!props.getTreeDataPath) {
      throw new Error(
        'Material-UI: getTreeDataPath should always be defined when treeData is activated.',
      );
    }

    const rows: RowWithPath[] = Object.entries(gridRowsLookupSelector(apiRef.current.state))
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

    // console.log(tree);
  }, [apiRef, props.treeData, props.getTreeDataPath]);

  useGridApiEventHandler(apiRef, GridEvents.rowsSet, handleRowsSet);
};
