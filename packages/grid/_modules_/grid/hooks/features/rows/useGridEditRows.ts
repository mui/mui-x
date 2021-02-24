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
import { GridEditRowsModel, GridEditRowUpdate } from '../../../models/gridEditRowModel';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridRowId, GridRowModelUpdate } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { buildGridCellParams } from '../../../utils/paramsUtils';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';

import { optionsSelector } from '../../utils/optionsSelector';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export function useGridEditRows(apiRef: GridApiRef) {
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);

  const getCellValue = React.useCallback(
    (id: GridRowId, field: string) => {
      const colDef = apiRef.current.getColumnFromField(field);
      const rowModel = apiRef.current.getRowFromId(id);

      if (!colDef || !colDef.valueGetter) {
        return rowModel[field];
      }

      return colDef.valueGetter(
        buildGridCellParams({
          value: rowModel[field],
          colDef,
          rowModel,
          api: apiRef.current,
        }),
      );
    },
    [apiRef],
  );

  const setCellEditMode = React.useCallback(
    (id, field) => {
      setGridState((state) => {
        if (state.editRows[id] && state.editRows[id][field]) {
          return state;
        }

        const currentCellEditState: GridEditRowsModel = { ...state.editRows };
        currentCellEditState[id] = currentCellEditState[id] || {};
        currentCellEditState[id][field] = { value: getCellValue(id, field) };

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
    [apiRef, forceUpdate, getCellValue, setGridState],
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
      if (options.editMode === GridFeatureModeConstant.server) {
        apiRef.current.publishEvent(GRID_CELL_VALUE_CHANGE_COMMITTED, {
          update,
          api: apiRef.current,
        });
        return;
      }
      apiRef.current.updateRows([update]);
      const field = Object.keys(update).find((key) => key !== 'id')!;
      apiRef.current.setCellMode(update.id, field, 'view');
    },
    [apiRef, options.editMode],
  );

  const setEditCellValue = React.useCallback(
    (update: GridEditRowUpdate) => {
      if (options.editMode === GridFeatureModeConstant.server) {
        apiRef.current.publishEvent(GRID_CELL_VALUE_CHANGE, { update, api: apiRef.current });
        return;
      }
      setGridState((state) => {
        const newState = { ...state.editRows };
        newState[update.id] = {
          ...state.editRows[update.id],
          ...update,
        };

        return { ...state, editRows: newState };
      });
      forceUpdate();
    },
    [apiRef, forceUpdate, options.editMode, setGridState],
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
  // TODO cleanup params What should we put?
  const onEditCellValueChange = React.useCallback(
    (handler: (param: { update: GridEditRowUpdate }) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_VALUE_CHANGE, handler);
    },
    [apiRef],
  );
  const onEditCellValueChangeCommitted = React.useCallback(
    (handler: (param: { update: GridEditRowUpdate }) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_VALUE_CHANGE_COMMITTED, handler);
    },
    [apiRef],
  );
  const onCellModeChange = React.useCallback(
    (handler: (param: { update: GridEditRowUpdate }) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_MODE_CHANGE, handler);
    },
    [apiRef],
  );
  const onEditRowModelChange = React.useCallback(
    (handler: (param: { update: GridEditRowUpdate }) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_EDIT_ROW_MODEL_CHANGE, handler);
    },
    [apiRef],
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
    {
      getCellValue,
      setCellMode,
      onEditRowModelChange,
      onCellModeChange,
      onEditCellValueChangeCommitted,
      onEditCellValueChange,
      isCellEditable,
      commitCellValueChanges,
      setEditCellValue,
      setEditRowsModel,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, forceUpdate, options.editRowsModel]);
}
