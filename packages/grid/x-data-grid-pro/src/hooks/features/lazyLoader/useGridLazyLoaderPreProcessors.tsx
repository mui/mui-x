import * as React from 'react';
import { GridPipeProcessor, useGridRegisterPipeProcessor } from '@mui/x-data-grid/internals';
import { GridFeatureModeConstant, GridRowId } from '@mui/x-data-grid';
import {
  DataGridProProcessedProps,
  GridExperimentalProFeatures,
} from '../../../models/dataGridProProps';
import { GridApiPro } from '../../../models/gridApiPro';

export const GRID_SKELETON_ROW_ROOT_ID = 'auto-generated-skeleton-row-root';

const getSkeletonRowId = (index: number) => `${GRID_SKELETON_ROW_ROOT_ID}-${index}`;

export const useGridLazyLoaderPreProcessors = (
  apiRef: React.MutableRefObject<GridApiPro>,
  props: Pick<DataGridProProcessedProps, 'rowCount' | 'rowsLoadingMode' | 'experimentalFeatures'>,
) => {
  const { lazyLoading } = (props.experimentalFeatures ?? {}) as GridExperimentalProFeatures;

  const addSkeletonRows = React.useCallback<GridPipeProcessor<'hydrateRows'>>(
    (groupingParams) => {
      if (
        !lazyLoading ||
        props.rowsLoadingMode !== GridFeatureModeConstant.server ||
        !props.rowCount ||
        groupingParams.ids.length >= props.rowCount
      ) {
        return groupingParams;
      }

      const newRowsIds: GridRowId[] = [...groupingParams.ids];

      for (let i = 0; i < props.rowCount - groupingParams.ids.length; i += 1) {
        const skeletonId = getSkeletonRowId(i);
        newRowsIds.push(skeletonId);
      }

      return {
        ...groupingParams,
        ids: newRowsIds,
      };
    },
    [props.rowCount, props.rowsLoadingMode, lazyLoading],
  );

  useGridRegisterPipeProcessor(apiRef, 'hydrateRows', addSkeletonRows);
};
