'use client';
import { RefObject } from '@mui/x-internals/types';
import { GridStateInitializer } from '../../utils/useGridInitializeState';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

export const rowReorderStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  rowReorder: {
    isActive: false,
  },
});

/**
 * API methods for row reorder state management
 */
export const useGridRowReorderApi = (apiRef: RefObject<GridPrivateApiCommunity>) => {
  const setRowDragActive = (isActive: boolean) => {
    apiRef.current.setState((state) => ({
      ...state,
      rowReorder: {
        ...state.rowReorder,
        isActive,
      },
    }));
  };

  useGridApiMethod(
    apiRef,
    {
      setRowDragActive,
    },
    'private',
  );
};
