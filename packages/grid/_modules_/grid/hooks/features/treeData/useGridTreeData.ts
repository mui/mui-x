import * as React from 'react';
import { GridRowConfigTree, GridRowId, GridRowsLookup } from '../../../models/gridRows';
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
import { insertLeafInTree } from '../rows/gridRowsUtils';

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
        .map((rowId) => ({
          id: rowId,
          path: props.getTreeDataPath!(params.idRowsLookup[rowId]),
        }))
        .sort((a, b) => a.path.length - b.path.length);

      const tree: GridRowConfigTree = new Map();
      const paths: Record<GridRowId, string[]> = {};
      const idRowsLookup: GridRowsLookup = { ...params.idRowsLookup };

      rows.forEach((row) => {
        insertLeafInTree({
          tree,
          path: row.path,
          id: row.id,
          defaultGroupingExpansionDepth: props.defaultGroupingExpansionDepth,
          paths,
          idRowsLookup,
        });
      });

      return {
        tree,
        paths,
        idRowsLookup,
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
        apiRef.current.UNSTABLE_setRowExpansion(
          params.id,
          !apiRef.current.UNSTABLE_getRowNode(params.id)?.expanded,
        );
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};
