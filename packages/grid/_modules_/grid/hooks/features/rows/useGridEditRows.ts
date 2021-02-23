import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_CELL_VALUE_CHANGE,
  GRID_CELL_VALUE_CHANGE_COMMITTED,
  GRID_EDIT_ROW_MODEL_CHANGE,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridRowModelUpdate } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';

import { optionsSelector } from '../../utils/optionsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(apiRef: GridApiRef) {
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);

  const setCellEditMode = React.useCallback(
    (id, field) => {
      setGridState((state) => {
        if (state.editRows[id] && state.editRows[id][field]) {
          return state;
        }

        const currentCellEditState: GridEditRowsModel = { ...state.editRows };
        currentCellEditState[id] = currentCellEditState[id] || {};
        currentCellEditState[id][field] = true;

        const newEditRowsState = { ...state.editRows, ...currentCellEditState };

        apiRef.current.publishEvent(GRID_EDIT_ROW_MODEL_CHANGE, newEditRowsState);
        return { ...state, editRows: newEditRowsState };
      });
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, {
        id,
        field,
        mode: 'edit',
        api: apiRef.current,
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, setGridState],
  );

  const setCellViewMode = React.useCallback(
    (id, field) => {
      setGridState((state) => {
        const newEditRowsState: GridEditRowsModel = { ...state.editRows };

        if (!newEditRowsState[id] || !newEditRowsState[id][field]) {
          return state;
        }

        if (newEditRowsState[id][field]) {
          delete newEditRowsState[id][field];
          if (!Object.keys(newEditRowsState[id]).length) {
            delete newEditRowsState[id];
          }
        }
        apiRef.current.publishEvent(GRID_EDIT_ROW_MODEL_CHANGE, newEditRowsState);

        return { ...state, editRows: newEditRowsState };
      });
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, {
        id,
        field,
        mode: 'view',
        api: apiRef.current,
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, setGridState],
  );

  const setCellMode = React.useCallback(
    (id, field, mode: GridCellMode) => {
      if (mode === 'edit') {
        setCellEditMode(id, field);
      } else {
        setCellViewMode(id, field);
      }
    },
    [setCellEditMode, setCellViewMode],
  );

  const isCellEditable = React.useCallback(
    (params: GridCellParams) => {
      return params.colDef.editable && (!options.isCellEditable || options.isCellEditable(params));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [options.isCellEditable],
  );

  const commitCellValueChanges = React.useCallback(
    (update: GridRowModelUpdate) => {
      if (apiRef.current.hasListener(GRID_CELL_VALUE_CHANGE_COMMITTED)) {
        apiRef.current.publishEvent(GRID_CELL_VALUE_CHANGE_COMMITTED, {
          update,
          api: apiRef.current,
        });
        return;
      }
      // TODO don't update when it's in server mode
      // How should we turn server mode? featureMode === 'server' ?

      apiRef.current.updateRows([update]);
      const field = Object.keys(update).find((key) => key !== 'id')!;
      apiRef.current.setCellMode(update.id, field, 'view');
    },
    [apiRef],
  );

  const setEditCellValue = React.useCallback(
    (update: GridRowModelUpdate) => {
      apiRef.current.publishEvent(GRID_CELL_VALUE_CHANGE, { update, api: apiRef.current });
    },
    [apiRef],
  );

  const setEditRowsModel = React.useCallback(
    (editRows: GridEditRowsModel) => {
      setGridState((state) => {
        const newState = { ...state, editRows };
        return newState;
      });
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );

  // TODO add those options.handlers on apiRef
  useGridApiEventHandler(apiRef, GRID_CELL_VALUE_CHANGE, options.onEditCellValueChange);
  useGridApiEventHandler(
    apiRef,
    GRID_CELL_VALUE_CHANGE_COMMITTED,
    options.onEditCellValueChangeCommitted,
  );
  useGridApiEventHandler(apiRef, GRID_CELL_MODE_CHANGE, options.onCellModeChange);
  useGridApiEventHandler(apiRef, GRID_EDIT_ROW_MODEL_CHANGE, options.onEditRowModelChange);

  useGridApiMethod<GridEditRowApi>(
    apiRef,
    { setCellMode, isCellEditable, commitCellValueChanges, setEditCellValue, setEditRowsModel },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, forceUpdate, options.editRowsModel]);
}
