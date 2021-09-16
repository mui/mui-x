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

const insertRowInTree = (
  tree: GridRowConfigTree,
  id: GridRowId,
  path: string[],
  depth: number = 0,
) => {
  if (path.length === 0) {
    throw new Error(`Material-UI: Could not insert row #${id} in the tree structure.`);
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
      throw new Error(`Material-UI: Could not insert row #${id} in the tree structure.`);
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
  props: Pick<GridComponentProps, 'treeData' | 'getTreeDataPath' | 'getRowId' | 'groupingColDef'>,
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
        throw new Error('Material-UI: No getTreeDataPath given.');
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

  React.useEffect(() => {
    if (!props.treeData) {
      apiRef.current.registerColumnPreProcessing('treeData', null);
    } else {
      const addGroupingColumn: GridColumnsPreProcessing = (columns) => {
        const index = columns[0].type === 'checkboxSelection' ? 1 : 0
        const groupingColumn = {
          ...GridTreeDataGroupColDef,
          ...props.groupingColDef,
        }

        return [
            ...columns.slice(0, index),
            groupingColumn,
            ...columns.slice(index)
        ];
      };

      apiRef.current.registerColumnPreProcessing('treeData', addGroupingColumn);
    }
  }, [apiRef, props.treeData, props.groupingColDef]);
};
