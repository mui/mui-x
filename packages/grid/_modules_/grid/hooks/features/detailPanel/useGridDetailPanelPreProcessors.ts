import * as React from 'react';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { DataGridProProcessedProps } from '../../../models/props/DataGridProProps';
import { useGridRegisterPreProcessor } from '../../core/preProcessing/useGridRegisterPreProcessor';
import {
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
} from './gridDetailPanelToggleColDef';
import { GridPreProcessor } from '../../core/preProcessing/gridPreProcessingApi';

export const useGridDetailPanelPreProcessors = (
  apiRef: GridApiRef,
  props: DataGridProProcessedProps,
) => {
  const addToggleColumn = React.useCallback<GridPreProcessor<'hydrateColumns'>>(
    (columnsState) => {
      if (props.getDetailPanelContent == null) {
        // Remove the toggle column, when it exists
        if (columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD]) {
          delete columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD];
          columnsState.all = columnsState.all.filter(
            (field) => field !== GRID_DETAIL_PANEL_TOGGLE_FIELD,
          );
        }
        return columnsState;
      }

      // Don't add the toggle column if there's already one
      // The user might have manually added it to have it in a custom position
      if (columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD]) {
        return columnsState;
      }

      // Othewise, add the toggle column at the beginning
      columnsState.all = [GRID_DETAIL_PANEL_TOGGLE_FIELD, ...columnsState.all];
      columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD] = GRID_DETAIL_PANEL_TOGGLE_COL_DEF;
      return columnsState;
    },
    [props.getDetailPanelContent],
  );

  useGridRegisterPreProcessor(apiRef, 'hydrateColumns', addToggleColumn);
};
