import * as React from 'react';
import { GridTreeDataApi } from './GridTreeDataApi';
import { GridRowId, GridRowIdTree } from '../../../models/gridRows';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridApiMethod } from '../../root/useGridApiMethod';

const insertRowInTree = (tree: GridRowIdTree, id: GridRowId, path: string[]) => {
  if (path.length === 0) {
    throw new Error(`Material-UI: Could not insert row #${id} in the tree structure.`);
  }

  if (path.length === 1) {
    tree[path[0]] = {
      id,
      children: {},
    };
  } else {
    const [nodeName, ...restPath] = path;

    if (!tree.hasOwnProperty(nodeName)) {
      throw new Error(`Material-UI: Could not insert row #${id} in the tree structure.`);
    }

    insertRowInTree(tree[nodeName].children, id, restPath);
  }
};

/**
 * Only available in DataGridPro
 */
export const useGridTreeData = (
  apiRef: GridApiRef,
  props: Pick<GridComponentProps, 'getTreeDataPath'>,
) => {
  const groupRows = React.useCallback<GridTreeDataApi['groupRows']>(
    (rowsLookup) => {
      const getTreeDataPath = props.getTreeDataPath ?? ((row) => [row.id.toString()]);

      const rows = Object.entries(rowsLookup)
        .map(([rowId, row]) => ({
          id: rowId,
          path: getTreeDataPath(row),
        }))
        .sort((a, b) => a.path.length - b.path.length);

      const tree = {};
      rows.forEach((row) => {
        insertRowInTree(tree, row.id, row.path);
      });

      return tree;
    },
    [props.getTreeDataPath],
  );

  const treeDataApi: GridTreeDataApi = {
    groupRows,
  };

  useGridApiMethod(apiRef, treeDataApi, 'GridTreeDataApi');
};
