import * as React from 'react';
import { GridEvents, GridEventListener } from '../../../models/events';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { isNavigationKey } from '../../../utils/keyboardUtils';
import { useGridApiEventHandler } from '../../utils/useGridApiEventHandler';
import { GridCellModes } from '../../../models/gridEditRowModel';

/**
 * @requires useGridParamsApi (method)
 */
export const useGridKeyboard = (apiRef: React.MutableRefObject<GridApiCommunity>): void => {
  const handleCellKeyDown = React.useCallback<GridEventListener<GridEvents.cellKeyDown>>(
    (params, event) => {
      // Ignore portal
      if (!event.currentTarget.contains(event.target as Element)) {
        return;
      }

      // Get the most recent params because the cell mode may have changed by another listener
      const cellParams = apiRef.current.getCellParams(params.id, params.field);
      const isEditMode = cellParams.cellMode === GridCellModes.Edit;
      if (isEditMode) {
        return;
      }

      if (event.key === ' ' && event.shiftKey) {
        // This is a select event, so it's handled by the selection hook
        return;
      }

      if (isNavigationKey(event.key)) {
        apiRef.current.publishEvent(GridEvents.cellNavigationKeyDown, cellParams, event);
      }
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellKeyDown, handleCellKeyDown);
};
