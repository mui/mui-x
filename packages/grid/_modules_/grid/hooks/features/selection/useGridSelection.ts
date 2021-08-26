import * as React from 'react';
import { GridEvents } from '../../../constants/eventsConstants';
import { GridComponentProps } from '../../../GridComponentProps';
import { GridApiRef } from '../../../models/api/gridApiRef';
import { GridSelectionApi } from '../../../models/api/gridSelectionApi';
import { GridRowParams } from '../../../models/params/gridRowParams';
import { GridRowId, GridRowModel } from '../../../models/gridRows';
import { useGridApiEventHandler } from '../../root/useGridApiEventHandler';
import { useGridApiMethod } from '../../root/useGridApiMethod';
import { optionsSelector } from '../../utils/optionsSelector';
import { useLogger } from '../../utils/useLogger';
import { useGridSelector } from '../core/useGridSelector';
import { useGridState } from '../core/useGridState';
import { gridRowsLookupSelector } from '../rows/gridRowsSelector';
import {
  gridSelectionStateSelector,
  selectedGridRowsSelector,
  selectedIdsLookupSelector,
} from './gridSelectionSelector';
import {sortedGridRowsSelector} from "../sorting";

type GridSelectionMode = 'multiple' | 'single' | 'range'

interface RowModelParams {
  id: GridRowId;
  row: GridRowModel;
  isSelected?: boolean;
  forceToggle,
  selectionMode: GridSelectionMode;
}

export const useGridSelection = (apiRef: GridApiRef, props: GridComponentProps): void => {
  const logger = useLogger('useGridSelection');
  const [, setGridState, forceUpdate] = useGridState(apiRef);
  const options = useGridSelector(apiRef, optionsSelector);
  const rowsLookup = useGridSelector(apiRef, gridRowsLookupSelector);

  const lastRowToggledByClick = React.useRef<GridRowId | null>(null)

  const propSelectionModel = React.useMemo(() => {
    if (props.selectionModel == null) {
      return props.selectionModel;
    }

    if (Array.isArray(props.selectionModel)) {
      return props.selectionModel;
    }

    return [props.selectionModel];
  }, [props.selectionModel]);

  const { checkboxSelection, disableMultipleSelection, disableSelectionOnClick, isRowSelectable } =
    options;

  const getSelectedRows = React.useCallback(
    () => selectedGridRowsSelector(apiRef.current.state),
    [apiRef],
  );

  const selectRowModel = React.useCallback(
    (rowModelParams: RowModelParams) => {
      const { id, isSelected, selectionMode, forceToggle } = rowModelParams;

      if (isRowSelectable && !isRowSelectable(apiRef.current.getRowParams(id))) {
        return;
      }

      logger.debug(`Selecting row ${id}`);

      setGridState((state) => {
        const selection = gridSelectionStateSelector(state)
        let newSelection: GridRowId[]

        const isRowSelectedBefore = selection.includes(id)

        switch (selectionMode) {
          case "single": {
            const shouldRowBeSelectedAfter = isSelected ?? (forceToggle ? !isRowSelectedBefore : true)

            if (shouldRowBeSelectedAfter) {
              newSelection = [id]
            } else {
              newSelection = []
            }
            break;
          }

          case "multiple": {
            const shouldRowBeSelectedAfter = isSelected ?? !isRowSelectedBefore

            newSelection = selection.filter(el => el !== id)

            if (shouldRowBeSelectedAfter) {
              newSelection.push(id)
            }

            break;
          }

          case "range": {
            if (lastRowToggledByClick.current == null) {
              newSelection = [id]
            } else {
              const shouldRowBeSelectedAfter = isSelected ?? !isRowSelectedBefore

              const sortedRowsId = [...sortedGridRowsSelector(state).keys()]
              const lastClickedId = sortedRowsId.indexOf(lastRowToggledByClick.current)
              const clickedId = sortedRowsId.indexOf(id)
              const [start, end] = lastClickedId > clickedId ? [clickedId, lastClickedId] : [lastClickedId, clickedId]
              const rowsToToggleId = sortedRowsId.slice(start, end + 1)

              newSelection = [
                  ...selection.filter(el => !rowsToToggleId.includes(el)),
                  ...(shouldRowBeSelectedAfter ? rowsToToggleId : [])
              ]
            }

            break;
          }

          default: {
            newSelection = selection
          }
        }

        return { ...state, selection: newSelection };
      });

      lastRowToggledByClick.current = id
      forceUpdate();
    },
    [
      isRowSelectable,
      apiRef,
      logger,
      forceUpdate,
      setGridState,
    ],
  );

  const selectRow = React.useCallback(
    (id: GridRowId, isSelected = true, allowMultiple = false) => {
      const row = apiRef.current.getRow(id);

      if (!row) {
        return;
      }

      selectRowModel({
        id,
        row,
        isSelected,
        selectionMode: allowMultiple ? 'multiple' : 'single',
        forceToggle: false,
      });
    },
    [apiRef, selectRowModel],
  );

  const selectRows = React.useCallback(
    (ids: GridRowId[], isSelected = true, deSelectOthers = false) => {
      const selectableIds = isRowSelectable
        ? ids.filter((id) => isRowSelectable(apiRef.current.getRowParams(id)))
        : ids;

      if (disableMultipleSelection && selectableIds.length > 1 && !checkboxSelection) {
        return;
      }

      setGridState((state) => {
        if (deSelectOthers) {
          return { ...state, selection: isSelected ? selectableIds : [] }
        }

        // We clone the existing map to avoid mutating the same map returned by the selector to others part of the project
        const selectionLookup = new Map(selectedIdsLookupSelector(state).entries())

        selectableIds.forEach((id) => {
          if (isSelected) {
            selectionLookup.set(id, true);
          } else {
            selectionLookup.delete(id)
          }
        });

        return {
          ...state,
          selection: [...selectionLookup.keys()],
        }
      });

      forceUpdate();
    },
    [
      isRowSelectable,
      disableMultipleSelection,
      checkboxSelection,
      setGridState,
      forceUpdate,
      apiRef,
    ],
  );

  const setSelectionModel = React.useCallback<GridSelectionApi['setSelectionModel']>(
    (model) => {
      const currentModel = apiRef.current.state.selection;
      if (currentModel !== model) {
        setGridState((state) => ({ ...state, selection: model }));
      }
    },
    [setGridState, apiRef],
  );

  const handleRowClick = React.useCallback(
    (params: GridRowParams, event: React.MouseEvent) => {
      if (disableSelectionOnClick) {
        return
      }

      const hasCtrlKey = (event.metaKey || event.ctrlKey)

      let selectionMode: GridSelectionMode
      if (!disableMultipleSelection && event.shiftKey) {
        selectionMode = 'range'
      } else if ((!disableMultipleSelection && hasCtrlKey) || checkboxSelection) {
        selectionMode = 'multiple'
      } else {
        selectionMode = 'single'
      }

      selectRowModel({
        id: params.id,
        row: params.row,
        selectionMode,
        forceToggle: hasCtrlKey,
      });
    },
    [checkboxSelection, disableMultipleSelection, disableSelectionOnClick, selectRowModel],
  );

  useGridApiEventHandler(apiRef, GridEvents.rowClick, handleRowClick);

  const selectionApi: GridSelectionApi = {
    selectRow,
    getSelectedRows,
    selectRows,
    setSelectionModel,
  };
  useGridApiMethod(apiRef, selectionApi, 'GridSelectionApi');

  React.useEffect(() => {
    apiRef.current.updateControlState<GridRowId[]>({
      stateId: 'selection',
      propModel: propSelectionModel,
      propOnChange: props.onSelectionModelChange,
      stateSelector: gridSelectionStateSelector,
      changeEvent: GridEvents.selectionChange,
    });
  }, [apiRef, props.onSelectionModelChange, propSelectionModel]);

  React.useEffect(() => {
    // Rows changed
    setGridState((state) => {
      const newSelectionState = gridSelectionStateSelector(state);
      // We clone the existing map to avoid mutating the same map returned by the selector to others part of the project
      const selectionLookup = new Map(selectedIdsLookupSelector(state).entries());
      let hasChanged = false;
      newSelectionState.forEach((id: GridRowId) => {
        if (!rowsLookup[id]) {
          selectionLookup.delete(id);
          hasChanged = true;
        }
      });
      if (hasChanged) {
        return { ...state, selection: [...selectionLookup.keys()] };
      }
      return state;
    });
    forceUpdate();
  }, [rowsLookup, apiRef, setGridState, forceUpdate]);

  React.useEffect(() => {
    if (propSelectionModel === undefined) {
      return;
    }

    apiRef.current.setSelectionModel(propSelectionModel);
  }, [apiRef, propSelectionModel, setGridState]);

  React.useEffect(() => {
    // isRowSelectable changed
    setGridState((state) => {
      const newSelectionState = state.selection.filter(id => !isRowSelectable || isRowSelectable(apiRef.current.getRowParams(id)))

      if (newSelectionState.length < state.selection.length) {
        return { ...state, selection: newSelectionState }
      }

      return state;
    });
    forceUpdate();
  }, [apiRef, setGridState, forceUpdate, isRowSelectable]);
};
