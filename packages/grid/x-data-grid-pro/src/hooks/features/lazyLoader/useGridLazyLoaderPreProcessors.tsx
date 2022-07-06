import * as React from 'react';
import { DataGridProProcessedProps } from '@mui/x-data-grid-pro/models/dataGridProProps';
import { GridApiPro } from '@mui/x-data-grid-pro/models/gridApiPro';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { GridRowId } from '@mui/x-data-grid';

export const GRID_SKELETON_ROW_ROOT_ID = 'auto-generated-skeleton-row-root';

const getSkeletonRowId = (index: GridRowId | null) => {
  if (index == null) {
    return GRID_SKELETON_ROW_ROOT_ID;
  }

  return `auto-generated-skeleton-row-root-${index}`;
};

export const useGridLazyLoaderPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'rows' | 'rowCount' | 'rowsLoadingMode'>,
) => {
  const addSkeletonRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      if (
        props.rowsLoadingMode === 'server' &&
        props.rowCount &&
        props.rows.length < props.rowCount
      ) {
        const newRowsIds: GridRowId[] = [...groupingParams.ids];

        for (let i = 0; i < props.rowCount - groupingParams.ids.length; i += 1) {
          const skeletonId = getSkeletonRowId(i);
          newRowsIds.push(skeletonId);
        }

        return {
          ...groupingParams,
          ids: newRowsIds,
        };
      }

      return groupingParams;
    },
    [props.rows, props.rowCount, props.rowsLoadingMode],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateRows', addSkeletonRows);
};
