import * as React from 'react';
import { GridRowId, GridRowConfigTree, GridRowsLookup } from '../../../models/gridRows';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridColumnsPreProcessing } from '../../root/columnsPreProcessing';
import { GridTreeDataGroupColDef } from './gridTreeDataGroupColDef';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { GridEvents } from '../../../constants';
import { GridCellParams, GridColDef, MuiEvent } from '../../../models';
import { isSpaceKey } from '../../../utils/keyboardUtils';
import { useFirstRender } from '../../utils/useFirstRender';
import { GridRowGroupingPreProcessing } from '../../root/rowGroupsPerProcessing';

/**
 * Only available in DataGridPro
 * @requires useGridColumnsPreProcessing (method)
 * @requires useGridRowGroupsPreProcessing (method)
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
      return apiRef.current.registerRowGroupsBuilder('treeData', null);
    }

    const groupRows: GridRowGroupingPreProcessing = (params) => {
      if (!props.getTreeDataPath) {
        throw new Error('MUI: No getTreeDataPath given.');
      }

      const rows = params.ids
        .map((rowId) => {
          return {
            id: rowId,
            path: props.getTreeDataPath!(params.idRowsLookup[rowId]),
          };
        })
        .sort((a, b) => a.path.length - b.path.length);

      const paths = Object.fromEntries(rows.map((row) => [row.id, row.path]));
      const fullTree: GridRowConfigTree = new Map();
      const idRowsLookupFiller: GridRowsLookup = {};
      const fillerPaths: Record<GridRowId, string[]> = {};

      const insertRowInTree = ({
        tree,
        id,
        path,
        originalPath,
        depth,
      }: {
        tree: GridRowConfigTree;
        id: GridRowId;
        path: string[];
        originalPath: string[];
        depth: number;
      }) => {
        if (path.length === 0) {
          throw new Error(`MUI: Could not insert row #${id} in the tree structure.`);
        }

        if (path.length === 1) {
          tree.set(path[0], {
            id,
            expanded: props.defaultGroupingExpansionDepth > depth,
          });
        } else {
          const [nodeName, ...restPath] = path;

          let parent = tree.get(nodeName);
          if (!parent) {
            const fillerPath = originalPath.slice(0, -1);
            const fillerId = `filler-row-${fillerPath.join('-')}`;
            parent = {
              id: fillerId,
              fillerNode: true,
              expanded: props.defaultGroupingExpansionDepth > depth,
            };

            idRowsLookupFiller[fillerId] = {};
            fillerPaths[fillerId] = fillerPath;

            tree.set(nodeName, parent);
          }

          if (!parent.children) {
            parent.children = new Map();
          }

          insertRowInTree({
            tree: parent.children,
            id,
            originalPath,
            path: restPath,
            depth: depth + 1,
          });
        }
      };

      rows.forEach((row) => {
        insertRowInTree({
          tree: fullTree,
          id: row.id,
          path: row.path,
          originalPath: row.path,
          depth: 0,
        });
      });

      return {
        tree: fullTree,
        paths: { ...paths, ...fillerPaths },
        idRowsLookup: { ...params.idRowsLookup, ...idRowsLookupFiller },
      };
    };

    return apiRef.current.registerRowGroupsBuilder('treeData', groupRows);
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
