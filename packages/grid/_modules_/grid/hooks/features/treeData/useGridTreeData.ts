import * as React from 'react';
import { GridRowId, GridRowConfigTree } from '../../../models/gridRows';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridColumnsPreProcessing } from '../../root/columnsPreProcessing';
import { GridTreeDataGroupColDef } from './gridTreeDataGroupColDef';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridEvents } from '../../../constants';
import { GridCellParams, GridColDef, MuiEvent } from '../../../models';
import { isSpaceKey } from '../../../utils/keyboardUtils';
import { useFirstRender } from '../../utils/useFirstRender';
import { RowGroupingFunction } from '../../root/rowGroupsPerProcessing';

const insertRowInTree = ({
  tree,
  id,
  path,
  depth,
  defaultGroupingExpansionDepth,
}: {
  tree: GridRowConfigTree;
  id: GridRowId;
  path: string[];
  depth: number;
  defaultGroupingExpansionDepth: number;
}) => {
  if (path.length === 0) {
    throw new Error(`MUI: Could not insert row #${id} in the tree structure.`);
  }

  if (path.length === 1) {
    tree.set(path[0], {
      id,
      depth,
      expanded: defaultGroupingExpansionDepth > depth,
    });
  } else {
    const [nodeName, ...restPath] = path;

    const parent = tree.get(nodeName);
    if (!parent) {
      throw new Error(`MUI: Could not insert row #${id} in the tree structure.`);
    }

    if (!parent.children) {
      parent.children = new Map();
    }

    insertRowInTree({
      tree: parent.children,
      id,
      path: restPath,
      depth: depth + 1,
      defaultGroupingExpansionDepth,
    });
  }
};

/**
 * Only available in DataGridPro
 */
export const useGridTreeData = (
  apiRef: GridApiRef,
  props: Pick<
    GridComponentProps,
    'treeData' | 'getTreeDataPath' | 'groupingColDef' | 'defaultGroupingExpansionDepth'
  >,
) => {
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

  const updateRowGrouping = React.useCallback(() => {
    if (!props.treeData) {
      return apiRef.current.registerRowGroupsBuilder(null);
    }

    const groupRows: RowGroupingFunction = (params) => {
      if (!props.getTreeDataPath) {
        throw new Error('MUI: No getTreeDataPath given.');
      }

      const rows = Object.values(params.lookup)
        .map((row) => {
          const id = params.gridRowId(row);

          return {
            id,
            path: props.getTreeDataPath!(row),
          };
        })
        .sort((a, b) => a.path.length - b.path.length);

      const paths = Object.fromEntries(rows.map((row) => [row.id, row.path]));
      const tree = new Map();
      rows.forEach((row) => {
        insertRowInTree({
          tree,
          id: row.id,
          path: row.path,
          depth: 0,
          defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
        });
      });

      return {
        tree,
        paths,
      };
    };

    return apiRef.current.registerRowGroupsBuilder(groupRows);
  }, [apiRef, props.getTreeDataPath, props.treeData, props.defaultGroupingExpansionDepth]);

  useFirstRender(() => {
    updateColumnsPreProcessing();
    updateRowGrouping();
  });

  const isFirstRender = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRender.current) {
      return;
    }

    updateColumnsPreProcessing();
  }, [updateColumnsPreProcessing]);

  React.useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    updateRowGrouping();
  }, [updateRowGrouping]);

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
