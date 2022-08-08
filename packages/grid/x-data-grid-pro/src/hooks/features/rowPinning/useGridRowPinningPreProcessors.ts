import * as React from 'react';
import {
  GridHydrateRowsValue,
  GridPipeProcessor,
  useGridRegisterPipeProcessor,
} from '@mui/x-data-grid/internals';
import {
  GRID_ROOT_GROUP_ID,
  GridGroupNode,
  GridRowEntry,
  GridRowId,
  GridRowModel,
} from '@mui/x-data-grid';
import { GridApiPro } from '../../../models/gridApiPro';
import { GridPinnedRowsProp } from './gridRowPinningInterface';

type GridPinnedRowPosition = keyof GridPinnedRowsProp;

export function addPinnedRow({
  groupingParams,
  rowModel,
  rowId,
  position,
  apiRef,
}: {
  groupingParams: GridHydrateRowsValue;
  rowModel: GridRowModel;
  rowId: GridRowId;
  position: GridPinnedRowPosition;
  apiRef: React.MutableRefObject<GridApiPro>;
}) {
  const dataRowIdToModelLookup = { ...groupingParams.dataRowIdToModelLookup };
  const tree = { ...groupingParams.tree };

  // TODO: warn if id is already present in `props.rows`
  dataRowIdToModelLookup[rowId] = rowModel;
  // Do not push it to ids list so that pagination is not affected by pinned rows
  // ids.push(rowId);
  tree[rowId] = {
    type: 'pinnedRow',
    id: rowId,
    depth: 0,
    parent: GRID_ROOT_GROUP_ID,
  };

  apiRef.current.unstable_caches.rows.dataRowIdToModelLookup[rowId] = { ...rowModel };
  apiRef.current.unstable_caches.rows.dataRowIdToIdLookup[rowId] = rowId;

  const previousPinnedRows = groupingParams.additionalRowGroups?.pinnedRows || {};

  const newPinnedRow: GridRowEntry = { id: rowId, model: rowModel };

  if (groupingParams.additionalRowGroups?.pinnedRows?.[position]?.includes(newPinnedRow)) {
    return {
      ...groupingParams,
      dataRowIdToModelLookup,
      tree,
    };
  }

  return {
    ...groupingParams,
    dataRowIdToModelLookup,
    tree,
    additionalRowGroups: {
      ...groupingParams.additionalRowGroups,
      pinnedRows: {
        ...previousPinnedRows,
        [position]: [...(previousPinnedRows[position] || []), newPinnedRow],
      },
    },
  };
}

export const useGridRowPinningPreProcessors = (apiRef: React.MutableRefObject<GridApiPro>) => {
  const addPinnedRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      const pinnedRowsCache = apiRef.current.unstable_caches.pinnedRows || {};

      let newGroupingParams: GridHydrateRowsValue = {
        ...groupingParams,
        additionalRowGroups: {
          ...groupingParams.additionalRowGroups,
          // reset pinned rows state
          pinnedRows: {},
        },
      };

      pinnedRowsCache.topIds?.forEach((rowId) => {
        newGroupingParams = addPinnedRow({
          groupingParams: newGroupingParams,
          rowModel: pinnedRowsCache.idLookup[rowId],
          rowId,
          position: 'top',
          apiRef,
        });
      });
      pinnedRowsCache.bottomIds?.forEach((rowId) => {
        newGroupingParams = addPinnedRow({
          groupingParams: newGroupingParams,
          rowModel: pinnedRowsCache.idLookup[rowId],
          rowId,
          position: 'bottom',
          apiRef,
        });
      });

      // If row with the same `id` is present both in `rows` and `pinnedRows` - remove it from the root group children
      if (pinnedRowsCache.bottomIds?.length || pinnedRowsCache.topIds?.length) {
        const shouldKeepRow = (rowId: GridRowId) => {
          if (newGroupingParams.tree[rowId] && newGroupingParams.tree[rowId].type === 'pinnedRow') {
            return false;
          }
          return true;
        };

        const rootGroupNode = newGroupingParams.tree[GRID_ROOT_GROUP_ID] as GridGroupNode;
        newGroupingParams.tree[GRID_ROOT_GROUP_ID] = {
          ...rootGroupNode,
          children: rootGroupNode.children.filter(shouldKeepRow),
        };

        newGroupingParams.dataRowIds = newGroupingParams.dataRowIds.filter(shouldKeepRow);
      }

      return newGroupingParams;
    },
    [apiRef],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateRows', addPinnedRows);
};
