import * as React from 'react';
import {
  GRID_CELL_MODE_CHANGE,
  GRID_CELL_CHANGE,
  GRID_CELL_CHANGE_COMMITTED,
  GRID_EDIT_ROW_MODEL_CHANGE,
} from '../../../constants/eventsConstants';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridEditRowApi } from '../../../models/api/gridEditRowApi';
import { GridCellMode } from '../../../models/gridCell';
import { GridEditRowsModel, GridEditRowUpdate } from '../../../models/gridEditRowModel';
import { GridFeatureModeConstant } from '../../../models/gridFeatureMode';
import { GridRowId } from '../../../models/gridRows';
import { GridCellParams } from '../../../models/params/gridCellParams';
import {
  GridCellModeChangeParams,
  GridEditCellParams,
  GridEditRowModelParams,
} from '../../../models/params/gridEditCellParams';
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
        currentCellEditState[id] = { ...currentCellEditState[id] } || {};
        currentCellEditState[id][field] = { value: getCellValue(id, field) };

        const newEditRowsState: GridEditRowsModel = { ...state.editRows, ...currentCellEditState };

        return { ...state, editRows: newEditRowsState };
      });
      forceUpdate();
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, {
        id,
        field,
        mode: 'edit',
        api: apiRef.current,
      });

      const editRowParams: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_EDIT_ROW_MODEL_CHANGE, editRowParams);
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
        return { ...state, editRows: newEditRowsState };
      });
      forceUpdate();
      const params: GridCellModeChangeParams = {
        id,
        field,
        mode: 'view',
        api: apiRef.current,
      };
      apiRef.current.publishEvent(GRID_CELL_MODE_CHANGE, params);
      const editRowParams: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_EDIT_ROW_MODEL_CHANGE, editRowParams);
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

  const commitCellChange = React.useCallback(
    (id: GridRowId, update: GridEditRowUpdate) => {
      if (options.editMode === GridFeatureModeConstant.server) {
        const params: GridEditCellParams = { api: apiRef.current, id, update };
        apiRef.current.publishEvent(GRID_CELL_CHANGE_COMMITTED, params);
        return;
      }
      const field = Object.keys(update).find((key) => key !== 'id')!;
      const rowUpdate = { id };
      rowUpdate[field] = update[field].value;
      apiRef.current.updateRows([rowUpdate]);
      apiRef.current.setCellMode(id, field, 'view');
    },
    [apiRef, options.editMode],
  );

  const setEditCellProps = React.useCallback(
    (id: GridRowId, update: GridEditRowUpdate) => {
      if (options.editMode === GridFeatureModeConstant.server) {
        const params: GridEditCellParams = { api: apiRef.current, id, update };
        apiRef.current.publishEvent(GRID_CELL_CHANGE, params);
        return;
      }
      setGridState((state) => {
        const editRowsModel: GridEditRowsModel = { ...state.editRows };
        editRowsModel[id] = {
          ...state.editRows[id],
          ...update,
        };
        return { ...state, editRows: editRowsModel };
      });
      forceUpdate();
      const params: GridEditRowModelParams = {
        api: apiRef.current,
        model: apiRef.current.getState().editRows,
      };
      apiRef.current.publishEvent(GRID_EDIT_ROW_MODEL_CHANGE, params);
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
  const onEditRowModelChange = React.useCallback(
    (handler: (param: GridEditRowModelParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_EDIT_ROW_MODEL_CHANGE, handler);
    },
    [apiRef],
  );
  const onCellModeChange = React.useCallback(
    (handler: (param: GridCellModeChangeParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_MODE_CHANGE, handler);
    },
    [apiRef],
  );
  const onEditCellChange = React.useCallback(
    (handler: (param: GridEditCellParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_CHANGE, handler);
    },
    [apiRef],
  );
  const onEditCellChangeCommitted = React.useCallback(
    (handler: (param: GridEditCellParams) => void): (() => void) => {
      return apiRef.current.subscribeEvent(GRID_CELL_CHANGE_COMMITTED, handler);
    },
    [apiRef],
  );

  useGridApiEventHandler(apiRef, GRID_CELL_CHANGE, options.onEditCellChange);
  useGridApiEventHandler(apiRef, GRID_CELL_CHANGE_COMMITTED, options.onEditCellChangeCommitted);
  useGridApiEventHandler(apiRef, GRID_CELL_MODE_CHANGE, options.onCellModeChange);
  useGridApiEventHandler(apiRef, GRID_EDIT_ROW_MODEL_CHANGE, options.onEditRowModelChange);

  useGridApiMethod<GridEditRowApi>(
    apiRef,
    {
      getCellValue,
      setCellMode,
      onEditRowModelChange,
      onCellModeChange,
      onEditCellChangeCommitted,
      onEditCellChange,
      isCellEditable,
      commitCellChange,
      setEditCellProps,
      setEditRowsModel,
    },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, options.editRowsModel]);
}
