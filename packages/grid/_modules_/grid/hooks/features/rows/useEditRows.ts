import * as React from 'react';
import {
  CELL_MODE_CHANGE,
  CELL_VALUE_CHANGE,
  CELL_VALUE_CHANGE_COMMITTED,
  EDIT_ROW_MODEL_CHANGE,
} from '../../../constants/eventsConstants';
import { ApiRef } from '../../../models/api/apiRef';
import { EditRowApi } from '../../../models/api/rowApi';
import { CellMode, CellValue } from '../../../models/cell';
import { CellParams } from '../../../models/params/cellParams';
import { RowModelUpdate } from '../../../models/rows';
import { useApiEventHandler } from '../../root/useApiEventHandler';
import { useApiMethod } from '../../root/useApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { GridState } from '../core/gridState';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';

export interface EditCellProps {
  value: CellValue;
  [prop: string]: any;
}

export type EditRow = { [field: string]: true | EditCellProps };
export type EditRowsModel = { [rowId: string]: EditRow };

export const editRowsStateSelector = (state: GridState) => state.editRows;

export function useEditRows(apiRef: ApiRef) {
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);

  const setCellEditMode = React.useCallback(
    (id, field) => {
      setGridState((state) => {
        const currentCellEditState: EditRowsModel = { ...state.editRows };
        currentCellEditState[id] = currentCellEditState[id] || {};
        currentCellEditState[id][field] = true;

        const newEditRowsState = { ...state.editRows, ...currentCellEditState };

        apiRef.current.publishEvent(EDIT_ROW_MODEL_CHANGE, newEditRowsState);
        return { ...state, editRows: newEditRowsState };
      });
      apiRef.current.publishEvent(CELL_MODE_CHANGE, {
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
        const newEditRowsState: EditRowsModel = { ...state.editRows };

        if (!newEditRowsState[id]) {
          return state;
        }

        if (newEditRowsState[id][field]) {
          delete newEditRowsState[id][field];
          if (!Object.keys(newEditRowsState[id]).length) {
            delete newEditRowsState[id];
          }
        }
        apiRef.current.publishEvent(EDIT_ROW_MODEL_CHANGE, newEditRowsState);

        return { ...state, editRows: newEditRowsState };
      });
      apiRef.current.publishEvent(CELL_MODE_CHANGE, {
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
    (id, field, mode: CellMode) => {
      if (mode === 'edit') {
        setCellEditMode(id, field);
      } else {
        setCellViewMode(id, field);
      }
    },
    [setCellEditMode, setCellViewMode],
  );

  const isCellEditable = React.useCallback(
    (params: CellParams) => {
      return params.colDef.editable && (!options.isCellEditable || options.isCellEditable(params));
    },
    [options.isCellEditable],
  );

  const commitCellValueChanges = React.useCallback(
    (update: RowModelUpdate) => {
      if (apiRef.current.hasListener(CELL_VALUE_CHANGE_COMMITTED)) {
        apiRef.current.publishEvent(CELL_VALUE_CHANGE_COMMITTED, { update, api: apiRef.current });
        return;
      }
      //TODO don't update when it's in server mode
      //How should we turn server mode? featureMode === 'server' ?

      apiRef.current.updateRows([update]);
      const field = Object.keys(update).find((key) => key !== 'id')!;
      apiRef.current.setCellMode(update.id, field, 'view');
    },
    [apiRef],
  );

  const setEditCellValue = React.useCallback(
    (update: RowModelUpdate) => {
      apiRef.current.publishEvent(CELL_VALUE_CHANGE, { update, api: apiRef.current });
    },
    [apiRef],
  );

  const setEditRowsModel = React.useCallback(
    (editRows: EditRowsModel) => {
      setGridState((state) => {
        const newState = { ...state, editRows };
        return newState;
      });
      forceUpdate();
    },
    [forceUpdate, setGridState],
  );

  //TODO add those options.handlers on apiRef
  useApiEventHandler(apiRef, CELL_VALUE_CHANGE, options.onEditCellValueChange);
  useApiEventHandler(apiRef, CELL_VALUE_CHANGE_COMMITTED, options.onEditCellValueChangeCommitted);
  useApiEventHandler(apiRef, CELL_MODE_CHANGE, options.onCellModeChange);
  useApiEventHandler(apiRef, EDIT_ROW_MODEL_CHANGE, options.onEditRowModelChange);

  useApiMethod<EditRowApi>(
    apiRef,
    { setCellMode, isCellEditable, commitCellValueChanges, setEditCellValue, setEditRowsModel },
    'EditRowApi',
  );

  React.useEffect(() => {
    apiRef.current.setEditRowsModel(options.editRowsModel || {});
  }, [apiRef, forceUpdate, options.editRowsModel]);
}
