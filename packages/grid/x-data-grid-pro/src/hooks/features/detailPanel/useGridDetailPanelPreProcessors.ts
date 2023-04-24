import * as React from 'react';
import { gridClasses } from '@mui/x-data-grid';
import { useGridRegisterPipeProcessor, GridPipeProcessor } from '@mui/x-data-grid/internals';
import { DataGridProProcessedProps } from '../../../models/dataGridProProps';
import {
  GRID_DETAIL_PANEL_TOGGLE_FIELD,
  GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
} from './gridDetailPanelToggleColDef';
import { GridPrivateApiPro } from '../../../models/gridApiPro';
import { gridDetailPanelExpandedRowIdsSelector } from './gridDetailPanelSelector';

export const useGridDetailPanelPreProcessors = (
  privateApiRef: React.MutableRefObject<GridPrivateApiPro>,
  props: DataGridProProcessedProps,
) => {
  const addToggleColumn = React.useCallback<GridPipeProcessor<'hydrateColumns'>>(
    (columnsState) => {
      if (props.getDetailPanelContent == null) {
        // Remove the toggle column, when it exists
        if (columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD]) {
          delete columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD];
          columnsState.orderedFields = columnsState.orderedFields.filter(
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

      // Otherwise, add the toggle column at the beginning
      columnsState.orderedFields = [GRID_DETAIL_PANEL_TOGGLE_FIELD, ...columnsState.orderedFields];
      columnsState.lookup[GRID_DETAIL_PANEL_TOGGLE_FIELD] = {
        ...GRID_DETAIL_PANEL_TOGGLE_COL_DEF,
        headerName: privateApiRef.current.getLocaleText('detailPanelToggle'),
      };
      return columnsState;
    },
    [privateApiRef, props.getDetailPanelContent],
  );

  const addExpandedClassToRow = React.useCallback<GridPipeProcessor<'rowClassName'>>(
    (classes, id) => {
      if (props.getDetailPanelContent == null) {
        return classes;
      }

      const expandedRowIds = gridDetailPanelExpandedRowIdsSelector(privateApiRef.current.state);
      if (!expandedRowIds.includes(id)) {
        return classes;
      }

      return [...classes, gridClasses['row--detailPanelExpanded']];
    },
    [privateApiRef, props.getDetailPanelContent],
  );

  useGridRegisterPipeProcessor(privateApiRef, 'hydrateColumns', addToggleColumn);
  useGridRegisterPipeProcessor(privateApiRef, 'rowClassName', addExpandedClassToRow);
};
