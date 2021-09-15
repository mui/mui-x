import * as React from 'react';
import { GridTreeDataApi } from './GridTreeDataApi';
import {
  GridRowData,
  GridRowId,
  GridRowIdGetter,
  GridRowIdTree,
  GridRowIdTreeNode,
} from '../../../models/gridRows';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import {GridColumnsPreProcessing} from "../../root/columnsPreProcessing";
import {GridTreeDataCollapseColDef} from "./gridTreeDataCollapseColDef";

const insertRowInTree = (tree: GridRowIdTree, id: GridRowId, path: string[]) => {
  if (path.length === 0) {
    throw new Error(`Material-UI: Could not insert row #${id} in the tree structure.`);
  }

  if (path.length === 1) {
    tree.set(path[0], {
      id,
      children: new Map<string, GridRowIdTreeNode>(),
    });
  } else {
    const [nodeName, ...restPath] = path;

    const parent = tree.get(nodeName);
    if (!parent) {
      throw new Error(`Material-UI: Could not insert row #${id} in the tree structure.`);
    }

    insertRowInTree(parent.children, id, restPath);
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
  props: Pick<GridComponentProps, 'treeData' | 'getTreeDataPath' | 'getRowId'>,
) => {
  const groupRows = React.useCallback<GridTreeDataApi['groupRows']>(
    (rowsLookup) => {
      const getTreeDataPath =
        props.getTreeDataPath ?? ((row) => [getGridRowId(row, props.getRowId).toString()]);

      const rows = Object.values(rowsLookup)
        .map((row) => {
          const id = getGridRowId(row, props.getRowId);

          return {
            id,
            path: getTreeDataPath(row),
          };
        })
        .sort((a, b) => a.path.length - b.path.length);

      const tree = new Map<string, GridRowIdTreeNode>();
      rows.forEach((row) => {
        insertRowInTree(tree, row.id, row.path);
      });

      return tree;
    },
    [props.getTreeDataPath],
  );

  React.useEffect(() => {
      if (!props.treeData) {
          return
      }

      const addCollapseColumn: GridColumnsPreProcessing = (columns ) => [
          {
              ...GridTreeDataCollapseColDef,
          },
          ...columns,
      ]

      return apiRef.current.registerColumnPreProcessing(addCollapseColumn)
  }, [])

  const treeDataApi: GridTreeDataApi = {
    groupRows,
  };

  useGridApiMethod(apiRef, treeDataApi, 'GridTreeDataApi');
};
