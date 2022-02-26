import * as React from 'react';
import { GridEvents } from '../../../models/events';
import { DataGridProcessedProps } from '../../../models/props/DataGridProps';
import { GridApiCommunity } from '../../../models/api/gridApiCommunity';
import { GridEditingApi, GridEditingSharedApi } from '../../../models/api/gridEditingApi';
import { GridCellModes, GridEditRowsModel } from '../../../models/gridEditRowModel';
import { GridCellParams } from '../../../models/params/gridCellParams';
import { GridEditCellPropsParams } from '../../../models/params/gridEditCellParams';
import {
  useGridApiEventHandler,
  useGridApiOptionHandler,
} from '../../utils/useGridApiEventHandler';
import { useGridApiMethod } from '../../utils/useGridApiMethod';
import { useGridLogger } from '../../utils/useGridLogger';
import { gridEditRowsStateSelector } from './gridEditRowsSelector';
import { GridEventListener, GridRowId } from '../../../models';
import { useCellEditing } from './useGridCellEditing';
import { useGridRowEditing } from './useGridRowEditing';
import { GridStateInitializer } from '../../utils/useGridInitializeState';

export const editingStateInitializer: GridStateInitializer = (state) => ({
  ...state,
  editRows: {},
});

/**
 * @requires useGridFocus - can be after, async only
 * @requires useGridParamsApi (method)
 * @requires useGridColumns (state)
 */
export function useGridEditing(
  apiRef: React.MutableRefObject<GridApiCommunity>,
  props: Pick<
    DataGridProcessedProps,
    | 'editRowsModel'
    | 'onEditRowsModelChange'
    | 'isCellEditable'
    | 'onEditCellPropsChange'
    | 'editMode'
    | 'onRowEditCommit'
    | 'onRowEditStart'
    | 'onRowEditStop'
    | 'onCellEditCommit'
    | 'onCellEditStart'
    | 'onCellEditStop'
    | 'experimentalFeatures'
  >,
) {
  const logger = useGridLogger(apiRef, 'useGridEditRows');
  useCellEditing(apiRef, props);
  useGridRowEditing(apiRef, props);

  const debounceMap = React.useRef<Record<GridRowId, Record<string, [NodeJS.Timeout, () => void]>>>(
    {},
  );

  apiRef.current.unstable_updateControlState({
    stateId: 'editRows',
    propModel: props.editRowsModel,
    propOnChange: props.onEditRowsModelChange,
    stateSelector: gridEditRowsStateSelector,
    changeEvent: GridEvents.editRowsModelChange,
  });

  const isCellEditable = React.useCallback<GridEditingApi['isCellEditable']>(
    (params: GridCellParams) =>
      !params.rowNode.isAutoGenerated &&
      !!params.colDef.editable &&
      !!params.colDef!.renderEditCell &&
      (!props.isCellEditable || props.isCellEditable(params)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.isCellEditable],
  );

  const maybeDebounce = (
    id: GridRowId,
    field: string,
    debounceMs: number | undefined,
    callback: { (): void | Promise<boolean>; (): void },
  ) => {
    if (!debounceMs) {
      callback();
      return;
    }

    if (!debounceMap.current[id]) {
      debounceMap.current[id] = {};
    }

    if (debounceMap.current[id][field]) {
      const [timeout] = debounceMap.current[id][field];
      clearTimeout(timeout);
    }

    const callbackToRunImmediately = () => {
      callback();
      const [timeout] = debounceMap.current[id][field];
      clearTimeout(timeout);
      delete debounceMap.current[id][field];
    };

    const timeout = setTimeout(() => {
      callback();
      delete debounceMap.current[id][field];
    }, debounceMs);

    debounceMap.current[id][field] = [timeout, callbackToRunImmediately];
  };

  const runPendingEditCellValueChangeDebounce = React.useCallback<
    GridEditingSharedApi['unstable_runPendingEditCellValueChangeDebounce']
  >((id, field) => {
    if (!debounceMap.current[id]) {
      return;
    }
    if (!field) {
      Object.keys(debounceMap.current[id]).forEach((debouncedField) => {
        const [, callback] = debounceMap.current[id][debouncedField];
        callback();
      });
    } else if (debounceMap.current[id][field]) {
      const [, callback] = debounceMap.current[id][field];
      callback();
    }
  }, []);

  const setEditCellValue = React.useCallback<GridEditingApi['setEditCellValue']>(
    (params, event = {}) => {
      maybeDebounce(params.id, params.field, params.debounceMs, () => {
        if (props.experimentalFeatures?.preventCommitWhileValidating) {
          if (props.editMode === 'row') {
            return apiRef.current.unstable_setRowEditingEditCellValue(params);
          }
          return apiRef.current.unstable_setCellEditingEditCellValue(params);
        }

        const newParams: GridEditCellPropsParams = {
          id: params.id,
          field: params.field,
          props: { value: params.value },
        };
        return apiRef.current.publishEvent(GridEvents.editCellPropsChange, newParams, event);
      });
    },
    [apiRef, props.editMode, props.experimentalFeatures?.preventCommitWhileValidating],
  );

  const parseValue = React.useCallback<GridEditingApi['unstable_parseValue']>(
    (id, field, value) => {
      const column = apiRef.current.getColumn(field);
      return column.valueParser
        ? column.valueParser(value, apiRef.current.getCellParams(id, field))
        : value;
    },
    [apiRef],
  );

  const setEditCellProps = React.useCallback(
    (params: GridEditCellPropsParams) => {
      const { id, field, props: editProps } = params;
      logger.debug(`Setting cell props on id: ${id} field: ${field}`);
      apiRef.current.setState((state) => {
        const editRowsModel: GridEditRowsModel = { ...state.editRows };
        editRowsModel[id] = { ...state.editRows[id] };
        editRowsModel[id][field] = { ...editProps, value: parseValue(id, field, editProps.value) };
        return { ...state, editRows: editRowsModel };
      });
      apiRef.current.forceUpdate();

      const editRowsState = gridEditRowsStateSelector(apiRef.current.state);
      return editRowsState[id][field];
    },
    [apiRef, logger, parseValue],
  );

  const setEditRowsModel = React.useCallback<GridEditingApi['setEditRowsModel']>(
    (model) => {
      const currentModel = gridEditRowsStateSelector(apiRef.current.state);
      if (currentModel !== model) {
        logger.debug(`Setting editRows model`);
        apiRef.current.setState((state) => ({ ...state, editRows: model }));
        apiRef.current.forceUpdate();
      }
    },
    [apiRef, logger],
  );

  const getEditRowsModel = React.useCallback<GridEditingApi['getEditRowsModel']>(
    () => gridEditRowsStateSelector(apiRef.current.state),
    [apiRef],
  );

  const preventTextSelection = React.useCallback<GridEventListener<GridEvents.cellMouseDown>>(
    (params, event) => {
      const isMoreThanOneClick = event.detail > 1;
      if (params.isEditable && params.cellMode === GridCellModes.View && isMoreThanOneClick) {
        // If we click more than one time, then we prevent the default behavior of selecting the text cell.
        event.preventDefault();
      }
    },
    [],
  );

  useGridApiEventHandler(apiRef, GridEvents.cellMouseDown, preventTextSelection);

  useGridApiOptionHandler(apiRef, GridEvents.editCellPropsChange, props.onEditCellPropsChange); // TODO v6: remove, use `preProcessEditCellProps` instead

  const editingSharedApi: GridEditingSharedApi = {
    isCellEditable,
    setEditRowsModel,
    getEditRowsModel,
    setEditCellValue,
    unstable_setEditCellProps: setEditCellProps,
    unstable_parseValue: parseValue,
    unstable_runPendingEditCellValueChangeDebounce: runPendingEditCellValueChangeDebounce,
  };

  useGridApiMethod(apiRef, editingSharedApi, 'EditRowApi');

  React.useEffect(() => {
    if (props.editRowsModel !== undefined) {
      apiRef.current.setEditRowsModel(props.editRowsModel);
    }
  }, [apiRef, props.editRowsModel]);
}
